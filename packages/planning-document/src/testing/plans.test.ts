import { describe, it, expect } from "vitest";

import { planMeta, planWith, seededHeadings, textBlock } from "./plans.js";

describe("planWith", () => {
  it("places a KPI right under the Success criteria heading", () => {
    const kpi = textBlock("kpi", { kpiId: "k1" }, "Slow");
    const blocks = planWith("feature", { kpis: [kpi] });
    const headingAt = blocks.findIndex(
      (block) =>
        block.type === "section-heading" && block.props["slot"] === "kpis",
    );
    expect(blocks[headingAt + 1]).toEqual(kpi);
  });

  it("returns only the section headings when no content is given", () => {
    expect(planWith("refactor", {})).toEqual(seededHeadings("refactor"));
  });
});

describe("planMeta", () => {
  it("builds a draft ui-change plan titled New header", () => {
    expect(planMeta("ui-change", "New header")).toMatchObject({
      type: "ui-change",
      title: "New header",
      status: "draft",
    });
  });
});
