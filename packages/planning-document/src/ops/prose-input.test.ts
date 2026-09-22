import { describe, it, expect } from "vitest";

import type { BlockJson } from "../blocks/block-json.js";
import { partitionSections } from "../projection/partition.js";
import { planWith, textBlock, writtenBlocks } from "../testing/plans.js";
import { agentOpSchema, type AgentOp } from "./agent-ops.js";
import { applyOps } from "./apply-ops.js";
import { proseInputSchema, toProseBlocks } from "./prose-input.js";

const RICH_SCOPE: AgentOp = {
  op: "set-section-prose",
  slot: "scope",
  blocks: [
    {
      type: "bulletListItem",
      content: [
        { type: "text", text: "cached", styles: { bold: true } },
        { type: "text", text: " prices", styles: {} },
      ],
      children: [
        {
          type: "checkListItem",
          checked: true,
          content: [{ type: "text", text: "per market", styles: {} }],
          children: [],
        },
      ],
    },
    { type: "heading", level: 3, content: [] },
  ],
};

const TALKED = planWith("feature", {
  kpis: [
    textBlock("paragraph", {}, "Old wording."),
    textBlock("kpi", { kpiId: "k1", metric: "p95" }, "why"),
  ],
  scope: [
    textBlock("paragraph", {}, "Old wording."),
    textBlock("question", { questionId: "q-flag" }, "Which flag?"),
  ],
});

const writtenIn = (blocks: BlockJson[], slot: string) =>
  writtenBlocks(
    partitionSections(blocks).find((section) => section.slot === slot)?.blocks,
  );

describe("set-section-prose", () => {
  it("replaces the scope's prose with a nested bold list under ids its slot mints, keeping the question", () => {
    expect(writtenIn(applyOps(TALKED, [RICH_SCOPE]), "scope")).toMatchObject([
      {
        id: "scope-p-1",
        type: "bulletListItem",
        content: [
          { text: "cached", styles: { bold: true } },
          { text: " prices" },
        ],
        children: [
          {
            id: "scope-p-1-1",
            type: "checkListItem",
            props: { checked: true },
          },
        ],
      },
      { id: "scope-p-2", type: "heading", props: { level: 3 } },
      { type: "question", props: { questionId: "q-flag" } },
    ]);
  });

  it("keeps the KPI when the success criteria's prose is replaced", () => {
    const blocks = applyOps(TALKED, [{ ...RICH_SCOPE, slot: "kpis" }]);
    expect(writtenIn(blocks, "kpis").map((block) => block.type)).toEqual([
      "bulletListItem",
      "heading",
      "kpi",
    ]);
  });

  it("writes the same blocks when the same prose is sent twice", () => {
    const once = applyOps(TALKED, [RICH_SCOPE]);
    expect(applyOps(once, [RICH_SCOPE])).toEqual(once);
  });

  it("refuses a level 2 heading, which plan.md keeps for sections", () => {
    expect(
      agentOpSchema.safeParse({
        ...RICH_SCOPE,
        blocks: [{ type: "heading", level: 2, content: [] }],
      }).success,
    ).toBe(false);
  });
});

describe("proseInputSchema", () => {
  it("fills a level 3 heading, a text code block and a checklist item's empty content", () => {
    expect(
      [
        { type: "checkListItem" },
        { type: "heading" },
        { type: "codeBlock" },
      ].map((input) => proseInputSchema.parse(input)),
    ).toEqual([
      { type: "checkListItem", content: [], children: [] },
      { type: "heading", level: 3, content: [] },
      { type: "codeBlock", language: "text", content: [] },
    ]);
  });
});

describe("toProseBlocks", () => {
  it("writes a table as a header row and its rows, and code as plain text", () => {
    expect(
      toProseBlocks("scope", [
        {
          type: "table",
          rows: [[[{ type: "text", text: "Market", styles: {} }]]],
        },
        {
          type: "codeBlock",
          language: "ts",
          content: [{ type: "text", text: "run()", styles: { bold: true } }],
        },
      ]),
    ).toEqual([
      {
        id: "scope-p-1",
        type: "table",
        props: {},
        content: {
          type: "tableContent",
          headerRows: 1,
          rows: [{ cells: [[{ type: "text", text: "Market", styles: {} }]] }],
        },
        children: [],
      },
      {
        id: "scope-p-2",
        type: "codeBlock",
        props: { language: "ts" },
        content: [{ type: "text", text: "run()", styles: {} }],
        children: [],
      },
    ]);
  });
});
