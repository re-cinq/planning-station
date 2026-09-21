import { describe, it, expect } from "vitest";
import { BlockNoteEditor } from "@blocknote/core";
import { toPlanDocument } from "@re-cinq/planning-document";

import { planMeta, seeded, textBlock } from "../testing/fixtures.js";
import { projectBlocks, toEditorBlocks } from "./block-bridge.js";
import { planSchema } from "./plan-schema.js";

const META = planMeta("feature");

const FEATURE = [
  ...seeded("feature").slice(0, 2),
  textBlock(
    "kpi",
    { kpiId: "k1", metric: "p95", target: "200 ms", direction: "down" },
    "Checkout feels slow",
  ),
  ...seeded("feature").slice(2),
];

describe("projectBlocks", () => {
  it("projects blocks that went through BlockNote to the same sections and KPIs", () => {
    const editor = BlockNoteEditor.create({
      schema: planSchema,
      initialContent: toEditorBlocks(FEATURE),
    });
    const expected = toPlanDocument(FEATURE, META);
    expect(projectBlocks(editor.document, META)).toMatchObject({
      kpis: expected.kpis,
      sections: expected.sections.map(({ slot, title }) => ({ slot, title })),
    });
  });
});

describe("toEditorBlocks", () => {
  it("returns undefined for no blocks so BlockNote starts with its empty paragraph", () => {
    expect(toEditorBlocks([])).toBeUndefined();
  });
});
