import { describe, it, expect } from "vitest";

import { heading, paragraph, block } from "../testing/block-builders.js";
import type { Section } from "../plan/plan-document.js";
import {
  partitionSections,
  planTitle,
  PlanShapeError,
  sectionOrder,
} from "./partition.js";
import { titleBlock } from "./seed.js";

const outline = (sections: Section[]) =>
  sections.map((section) => ({
    slot: section.slot,
    ids: section.blocks.map((member) => member.id),
  }));

describe("planTitle", () => {
  it("reads the feature name from the title block above the first section", () => {
    const blocks = [
      titleBlock("Faster checkout"),
      heading("intent", "What we want and why"),
    ];
    expect(planTitle(blocks)).toEqual("Faster checkout");
  });

  it("is null for a document that carries no title block", () => {
    expect(planTitle([heading("intent", "What we want and why")])).toBeNull();
  });

  it("keeps the title out of the first section", () => {
    const sections = partitionSections([
      titleBlock("Faster checkout"),
      heading("intent", "What we want and why"),
      paragraph("Checkout is slow.", "p1"),
    ]);
    expect(outline(sections)).toEqual([{ slot: "intent", ids: ["p1"] }]);
  });
});

describe("partitionSections", () => {
  it("splits three headings into three sections holding the blocks after each", () => {
    const sections = partitionSections([
      heading("intent", "What we want and why"),
      paragraph("Faster checkout", "p1"),
      paragraph("Fewer drop-offs", "p2"),
      heading("kpis", "Success criteria"),
      block("kpi", { metric: "p95" }, { id: "k1" }),
      heading("scope", "In and out of scope"),
    ]);
    expect(outline(sections)).toEqual([
      { slot: "intent", ids: ["p1", "p2"] },
      { slot: "kpis", ids: ["k1"] },
      { slot: "scope", ids: [] },
    ]);
  });

  it("keeps the heading id h-intent and title on the section", () => {
    expect(
      partitionSections([heading("intent", "What we want and why")]),
    ).toEqual([
      {
        headingId: "h-intent",
        slot: "intent",
        title: "What we want and why",
        blocks: [],
      },
    ]);
  });

  it("returns no sections for no blocks", () => {
    expect(partitionSections([])).toEqual([]);
  });

  it("throws PlanShapeError for a paragraph before the first heading", () => {
    expect(() =>
      partitionSections([
        paragraph("stray", "p0"),
        heading("intent", "Intent"),
      ]),
    ).toThrow(
      new PlanShapeError("block p0 precedes the first section heading"),
    );
  });
});

describe("sectionOrder", () => {
  it("orders actions, p1, panel, c1 as c1, panel, p1, actions", () => {
    const blocks = sectionOrder([
      block("section-actions", { slot: "intent" }, { id: "actions" }),
      paragraph("Checkout is slow.", "p1"),
      block("section-panel", { slot: "intent" }, { id: "panel" }),
      block("comment", { author: "Ana" }, { id: "c1" }),
    ]);
    expect(blocks.map((member) => member.id)).toEqual([
      "c1",
      "panel",
      "p1",
      "actions",
    ]);
  });
});
