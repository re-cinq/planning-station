import { describe, it, expect } from "vitest";

import {
  blockHash,
  SectionChangedError,
  type AgentOp,
} from "@re-cinq/planning-document";
import {
  blockText,
  planWith,
  textBlock,
} from "@re-cinq/planning-document/testing";
import type { Doc } from "yjs";

import { applyOpsToDoc } from "../convert/apply-ops.js";
import { docFromBlocks, readBlocks } from "../convert/plan-doc.js";
import { askRefine, proposalsIn } from "./proposals.js";
import {
  acceptChange,
  applyChangeAnyway,
  changesIn,
  discardChange,
  proposeChanges,
  staleChanges,
} from "./changes.js";

const seeded = () =>
  docFromBlocks(
    planWith("feature", {
      intent: [
        textBlock("paragraph", {}, "Checkout is slow."),
        textBlock("paragraph", {}, "Carts are abandoned."),
      ],
    }),
  );

const idOf = (doc: Doc, text: string) =>
  readBlocks(doc).find((block) => blockText(block) === text)?.id ?? "";

const intentText = (doc: Doc) =>
  readBlocks(doc)
    .filter((block) => block.type === "paragraph")
    .map(blockText)
    .filter((text) => text !== "");

const rewrite = (doc: Doc, text: string): AgentOp => ({
  op: "replace-block",
  slot: "intent",
  blockId: idOf(doc, "Checkout is slow."),
  block: { type: "paragraph", content: [{ type: "text", text, styles: {} }] },
});

const drop = (doc: Doc): AgentOp => ({
  op: "remove-block",
  slot: "intent",
  blockId: idOf(doc, "Carts are abandoned."),
});

const proposed = (doc: Doc) =>
  proposeChanges(
    doc,
    {
      slot: "intent",
      ops: [rewrite(doc, "Checkout p95 is 450 ms."), drop(doc)],
      uses: { questions: [], comments: [] },
      proposedBy: "planning-agent",
    },
    "agent",
  );

describe("proposeChanges", () => {
  it("keeps the plan as it was: a change waits beside it until someone accepts", () => {
    const doc = seeded();
    proposed(doc);

    expect({ changes: changesIn(doc).length, text: intentText(doc) }).toEqual({
      changes: 2,
      text: ["Checkout is slow.", "Carts are abandoned."],
    });
  });

  it("answers the ask a person made, so the plan stops saying a refine is still coming", () => {
    const doc = seeded();
    askRefine(doc, { slot: "intent", askedBy: "Ana" });
    proposeChanges(
      doc,
      {
        slot: "intent",
        ops: [rewrite(doc, "Checkout p95 is 450 ms.")],
        uses: { questions: [], comments: [] },
        proposedBy: "planning-agent",
      },
      "agent",
    );

    expect(proposalsIn(doc)).toEqual([]);
  });

  it("accepts one change and leaves the other waiting", () => {
    const doc = seeded();
    const [rewriting] = proposed(doc);
    acceptChange(doc, rewriting?.changeId ?? "");

    expect({ text: intentText(doc), left: changesIn(doc).length }).toEqual({
      text: ["Checkout p95 is 450 ms.", "Carts are abandoned."],
      left: 1,
    });
  });

  it("refuses a change whose own paragraph changed after the agent read it", () => {
    const doc = seeded();
    const [rewriting] = proposed(doc);
    applyOpsToDoc(doc, [rewrite(doc, "Ben typed here.")]);

    expect(() => acceptChange(doc, rewriting?.changeId ?? "")).toThrow(
      SectionChangedError,
    );
  });

  it("names the changes whose paragraph moved on, leaving the rest acceptable", () => {
    const doc = seeded();
    const [rewriting] = proposed(doc);
    applyOpsToDoc(doc, [rewrite(doc, "Ben typed here.")]);

    expect(staleChanges(doc).map((change) => change.changeId)).toEqual([
      rewriting?.changeId,
    ]);
  });

  it("applies a stale change anyway, onto the paragraph as it stands", () => {
    const doc = seeded();
    const [rewriting] = proposed(doc);
    applyOpsToDoc(doc, [rewrite(doc, "Ben typed here.")]);
    applyChangeAnyway(doc, rewriting?.changeId ?? "");

    expect(intentText(doc)[0]).toEqual("Checkout p95 is 450 ms.");
  });

  it("drops a discarded change and leaves the plan alone", () => {
    const doc = seeded();
    const [, dropping] = proposed(doc);
    discardChange(doc, dropping?.changeId ?? "");

    expect({ left: changesIn(doc).length, text: intentText(doc) }).toEqual({
      left: 1,
      text: ["Checkout is slow.", "Carts are abandoned."],
    });
  });

  it("hashes each change against its own paragraph", () => {
    const doc = seeded();
    const [rewriting] = proposed(doc);

    expect(rewriting?.baseHash).toEqual(
      blockHash(readBlocks(doc), idOf(doc, "Checkout is slow.")),
    );
  });
});
