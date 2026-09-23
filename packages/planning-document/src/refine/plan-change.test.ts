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

  it("reads an inserted list item's nested children as their own lines, after the item", () => {
    expect(
      changeWords(
        change({
          op: "insert-blocks",
          slot: "intent",
          after: "p1",
          blocks: [
            {
              type: "bulletListItem",
              content: inlineFromText("Regions"),
              children: [
                {
                  type: "bulletListItem",
                  content: inlineFromText("EU"),
                  children: [],
                },
                {
                  type: "bulletListItem",
                  content: inlineFromText("US"),
                  children: [],
                },
              ],
            },
          ],
        }),
      ),
    ).toEqual(["Regions", "EU", "US"]);
  });

  it("reads a section-prose set as each prose block it writes, one line each", () => {
    expect(
      changeWords(
        change({
          op: "set-section-prose",
          slot: "intent",
          blocks: [NEW_TEXT, NEW_TEXT],
        }),
      ),
    ).toEqual(["p95 is 450 ms.", "p95 is 450 ms."]);
  });

  it("reads an append as each paragraph it appends", () => {
    expect(
      changeWords(
        change({
          op: "append-to-section",
          slot: "intent",
          paragraphs: ["Mobile is worse."],
        }),
      ),
    ).toEqual(["Mobile is worse."]);
  });

  it("reads a removal as no words at all, since what goes is the paragraph above", () => {
    expect(
      changeWords(
        change({ op: "remove-block", slot: "intent", blockId: "p1" }),
      ),
    ).toEqual([]);
  });

  it("reads a section-text set as each paragraph it writes, one line each", () => {
    expect(
      changeWords(
        change({
          op: "set-section-text",
          slot: "intent",
          paragraphs: ["Checkout is slow.", "Carts are abandoned."],
        }),
      ),
    ).toEqual(["Checkout is slow.", "Carts are abandoned."]);
  });

  it("reads a KPI upsert as metric, baseline to target, by deadline", () => {
    expect(
      changeWords(
        change({
          op: "upsert-kpi",
          kpi: {
            kpiId: "k1",
            metric: "checkout p95",
            baseline: "450 ms",
            target: "200 ms",
            direction: "down",
            deadline: "2026-Q4",
            rationale: "",
          },
        }),
      ),
    ).toEqual(["checkout p95: 450 ms → 200 ms by 2026-Q4"]);
  });

  it("reads a prototype set as maturity and url on one line", () => {
    expect(
      changeWords(
        change({
          op: "set-prototype",
          prototype: {
            maturity: "click-dummy",
            url: "https://figma.com/f/checkout",
            agreedBy: "",
            notes: "",
          },
        }),
      ),
    ).toEqual(["Prototype (click-dummy): https://figma.com/f/checkout"]);
  });

  it("reads an added section as its title, then each paragraph", () => {
    expect(
      changeWords(
        change({
          op: "add-section",
          slot: "custom-rollout",
          title: "Rollout",
          after: "intent",
          paragraphs: ["Ship to EU first."],
        }),
      ),
    ).toEqual(["Rollout", "Ship to EU first."]);
  });

  it("reads a section-title set as the new title", () => {
    expect(
      changeWords(
        change({
          op: "set-section-title",
          slot: "custom-rollout",
          title: "Rollout plan",
        }),
      ),
    ).toEqual(["Rollout plan"]);
  });

  it("reads an added question as its question text", () => {
    expect(
      changeWords(
        change({
          op: "add-question",
          slot: "intent",
          questionId: "q1",
          question: "Which regions count?",
          why: "",
          kind: "text",
          options: [],
        }),
      ),
    ).toEqual(["Which regions count?"]);
  });

  it("reads a KPI with only its metric as the metric alone, with no empty arrow or deadline", () => {
    expect(
      changeWords(
        change({
          op: "upsert-kpi",
          kpi: {
            kpiId: "k1",
            metric: "checkout p95",
            baseline: "",
            target: "",
            direction: "down",
            deadline: "",
            rationale: "",
          },
        }),
      ),
    ).toEqual(["checkout p95"]);
  });

  it("reads a prototype with no url as its maturity alone", () => {
    expect(
      changeWords(
        change({
          op: "set-prototype",
          prototype: { maturity: "none", url: "", agreedBy: "", notes: "" },
        }),
      ),
    ).toEqual(["Prototype (none)"]);
  });
});
