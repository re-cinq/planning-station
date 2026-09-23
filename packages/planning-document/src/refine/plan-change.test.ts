import { describe, it, expect } from "vitest";

import { inlineFromText } from "../blocks/inline-text.js";
import { planWith, textBlock } from "../testing/plans.js";
import {
  blockHash,
  changesFor,
  changeWords,
  type PlanChange,
} from "./plan-change.js";

const PLAN = planWith("feature", {
  intent: [
    textBlock("paragraph", {}, "Checkout is slow."),
    textBlock("paragraph", {}, "Carts are abandoned."),
  ],
});

const idOf = (text: string) =>
  PLAN.find((block) => JSON.stringify(block.content).includes(text))?.id ?? "";

const NEW_TEXT = {
  type: "paragraph" as const,
  content: inlineFromText("p95 is 450 ms."),
};

describe("changesFor", () => {
  it("makes one change per op, each anchored to the block it is about", () => {
    const changes = changesFor(PLAN, {
      slot: "intent",
      ops: [
        {
          op: "replace-block",
          slot: "intent",
          blockId: idOf("Checkout is slow."),
          block: NEW_TEXT,
        },
        {
          op: "insert-blocks",
          slot: "intent",
          after: idOf("Carts are abandoned."),
          blocks: [NEW_TEXT],
        },
      ],
      uses: { questions: ["q1"], comments: [] },
      proposedBy: "planning-agent",
    });

    expect(changes.map((change) => [change.op.op, change.anchorId])).toEqual([
      ["replace-block", idOf("Checkout is slow.")],
      ["insert-blocks", idOf("Carts are abandoned.")],
    ]);
  });

  it("hashes the block each change is about, so one paragraph's drift leaves the others acceptable", () => {
    const [change] = changesFor(PLAN, {
      slot: "intent",
      ops: [
        {
          op: "replace-block",
          slot: "intent",
          blockId: idOf("Checkout is slow."),
          block: NEW_TEXT,
        },
      ],
      uses: { questions: [], comments: [] },
      proposedBy: "planning-agent",
    });

    expect(change?.baseHash).toEqual(
      blockHash(PLAN, idOf("Checkout is slow.")),
    );
  });

  it("gives each change its own id, so accepting one leaves the rest waiting", () => {
    const ops = [
      {
        op: "remove-block" as const,
        slot: "intent",
        blockId: idOf("Checkout is slow."),
      },
      {
        op: "remove-block" as const,
        slot: "intent",
        blockId: idOf("Carts are abandoned."),
      },
    ];
    const changes = changesFor(PLAN, {
      slot: "intent",
      ops,
      uses: { questions: [], comments: [] },
      proposedBy: "planning-agent",
    });

    expect(new Set(changes.map((change) => change.changeId)).size).toEqual(2);
  });
});

describe("blockHash", () => {
  it("answers the empty hash for a block the plan no longer holds", () => {
    expect(blockHash(PLAN, "gone")).toEqual("");
  });
});

describe("changeWords", () => {
  const change = (op: PlanChange["op"]): PlanChange => ({
    changeId: "c1",
    slot: "intent",
    anchorId: "p1",
    baseHash: "h",
    op,
    uses: { questions: [], comments: [] },
    proposedBy: "planning-agent",
    proposedAt: "2026-09-23T00:00:00.000Z",
  });

  it("reads a rewrite as the words it puts in the paragraph's place", () => {
    expect(
      changeWords(
        change({
          op: "replace-block",
          slot: "intent",
          blockId: "p1",
          block: NEW_TEXT,
        }),
      ),
    ).toEqual(["p95 is 450 ms."]);
  });

  it("reads an insert as each paragraph it adds", () => {
    expect(
      changeWords(
        change({
          op: "insert-blocks",
          slot: "intent",
          after: "p1",
          blocks: [NEW_TEXT, NEW_TEXT],
        }),
      ),
    ).toEqual(["p95 is 450 ms.", "p95 is 450 ms."]);
  });

  it("reads a removal as no words at all, since what goes is the paragraph above", () => {
    expect(
      changeWords(
        change({ op: "remove-block", slot: "intent", blockId: "p1" }),
      ),
    ).toEqual([]);
  });
});
