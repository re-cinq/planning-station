import { describe, it, expect } from "vitest";
import { toPlanDocument, type BlockJson } from "@re-cinq/planning-document";
import {
  planMeta,
  planWith,
  textBlock,
} from "@re-cinq/planning-document/testing";
import { applyUpdate, Doc, encodeStateAsUpdate } from "yjs";

import {
  docFromBlocks,
  readBlocks,
  seedDoc,
  SeededDocError,
} from "./plan-doc.js";

const META = planMeta("feature");

const FEATURE = planWith("feature", {
  intent: [textBlock("paragraph", {}, "Checkout is slow on mobile.")],
  kpis: [
    textBlock("kpi", { kpiId: "k1", metric: "p95", direction: "down" }, "Slow"),
  ],
});

const project = (blocks: readonly BlockJson[]) => {
  const { sections, kpis } = toPlanDocument(blocks, META);

  return { slots: sections.map((section) => section.slot), kpis };
};

describe("readBlocks", () => {
  it("reads back the sections and the KPI a Y.Doc was seeded with", () => {
    expect(project(readBlocks(docFromBlocks(FEATURE)))).toEqual(
      project(FEATURE),
    );
  });

  it("reads the same plan from a fresh Y.Doc that received the seeded doc as an update", () => {
    const copy = new Doc();
    applyUpdate(copy, encodeStateAsUpdate(docFromBlocks(FEATURE)));
    expect(project(readBlocks(copy))).toEqual(project(FEATURE));
  });

  it("keeps the block ids, so a KPI stays addressable", () => {
    expect(readBlocks(docFromBlocks(FEATURE)).map(({ id }) => id)).toEqual(
      FEATURE.map(({ id }) => id),
    );
  });
});

describe("seedDoc", () => {
  it("throws SeededDocError when the doc already holds a plan", () => {
    expect(() => seedDoc(docFromBlocks(FEATURE), FEATURE)).toThrow(
      SeededDocError,
    );
  });
});
