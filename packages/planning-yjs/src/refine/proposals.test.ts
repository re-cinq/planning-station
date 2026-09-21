import { describe, it, expect } from "vitest";
import {
  ProposalScopeError,
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
import {
  acceptRefine,
  askRefine,
  discardRefine,
  NoProposalError,
  proposalsIn,
  proposeRefine,
} from "./proposals.js";

const OUT_OF_SCOPE: AgentOp = {
  op: "append-to-section",
  slot: "scope",
  paragraphs: ["Out: the payment provider's page."],
};

const seeded = () =>
  docFromBlocks(
    planWith("feature", {
      scope: [
        textBlock("paragraph", {}, "In: the price step."),
        textBlock("question", { questionId: "q-tax" }, "Which markets?"),
        textBlock("answer", { questionId: "q-tax" }, "Only the EU."),
      ],
    }),
  );

const askedByAna = () => {
  const doc = seeded();
  const { baseHash } = askRefine(doc, { slot: "scope", askedBy: "Ana" });

  return { doc, baseHash };
};

const proposed = () => {
  const { doc, baseHash } = askedByAna();
  proposeRefine(doc, {
    slot: "scope",
    baseHash,
    ops: [OUT_OF_SCOPE],
    uses: { questions: ["q-tax"], comments: [] },
    proposedBy: "planning-agent",
  });

  return doc;
};

const scopeText = (doc: Doc) =>
  readBlocks(doc)
    .filter((block) => block.type === "paragraph")
    .map(blockText);

describe("refine proposals", () => {
  it("shows Ana's ask for scope to everyone on the plan", () => {
    const { doc } = askedByAna();
    expect(proposalsIn(doc)).toMatchObject([
      { status: "asked", slot: "scope", askedBy: "Ana" },
    ]);
  });

  it("keeps the agent's proposal under Ana's name, without writing it into the plan", () => {
    const doc = proposed();
    expect({
      proposals: proposalsIn(doc),
      scope: scopeText(doc),
    }).toMatchObject({
      proposals: [
        { status: "proposed", askedBy: "Ana", uses: { questions: ["q-tax"] } },
      ],
      scope: ["In: the price step."],
    });
  });

  it("throws ProposalScopeError when a proposal for scope changes the intent", () => {
    const { doc, baseHash } = askedByAna();
    expect(() =>
      proposeRefine(doc, {
        slot: "scope",
        baseHash,
        ops: [{ op: "append-to-section", slot: "intent", paragraphs: ["x"] }],
        uses: { questions: [], comments: [] },
        proposedBy: "planning-agent",
      }),
    ).toThrow(ProposalScopeError);
  });

  it("writes the accepted paragraph into scope and clears the proposal", () => {
    const doc = proposed();
    acceptRefine(doc, "scope");
    expect({ proposals: proposalsIn(doc), scope: scopeText(doc) }).toEqual({
      proposals: [],
      scope: ["In: the price step.", "Out: the payment provider's page."],
    });
  });

  it("marks q-tax used when the proposal that used it is accepted", () => {
    const doc = proposed();
    acceptRefine(doc, "scope");
    expect(
      readBlocks(doc).find((block) => block.type === "question")?.props,
    ).toMatchObject({ questionId: "q-tax", used: true });
  });

  it("throws SectionChangedError when scope changed after Ana asked", () => {
    const doc = proposed();
    applyOpsToDoc(doc, [
      { op: "append-to-section", slot: "scope", paragraphs: ["Ben typed."] },
    ]);
    expect(() => acceptRefine(doc, "scope")).toThrow(SectionChangedError);
  });

  it("drops a discarded proposal and leaves scope as it was", () => {
    const doc = proposed();
    discardRefine(doc, "scope");
    expect({ proposals: proposalsIn(doc), scope: scopeText(doc) }).toEqual({
      proposals: [],
      scope: ["In: the price step."],
    });
  });

  it("throws NoProposalError when scope is accepted before the agent answered", () => {
    const { doc } = askedByAna();
    expect(() => acceptRefine(doc, "scope")).toThrow(NoProposalError);
  });
});
