import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";

import type { PlanEditorProps } from "../PlanEditor.js";
import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const PROTOTYPE_URL = "https://figma.test/checkout";

const SEED = planSeed("feature", {
  kpis: [
    textBlock(
      "kpi",
      { kpiId: "k1", metric: "p95", target: "200 ms", direction: "up" },
      "Checkout feels slow",
    ),
  ],
  prototype: [
    textBlock(
      "prototype",
      { maturity: "none", url: PROTOTYPE_URL },
      "Nothing to try yet",
    ),
    textBlock("mockup", { format: "svg", markup: "<svg/>", height: 120 }, ""),
  ],
});

const renderPlan = async (extra: Partial<PlanEditorProps> = {}) => {
  const editing = await renderAsAna(SEED, extra);
  await expect.element(editing.screen.getByLabelText("Metric")).toBeVisible();

  return editing;
};

describe("PlanBlockView", () => {
  it("shows the KPI metric p95 in its Metric field", async () => {
    const { screen } = await renderPlan();
    await expect.element(screen.getByLabelText("Metric")).toHaveValue("p95");
  });

  it("emits a KPI moving down after the direction is changed", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.selectOptions(screen.getByLabelText("Direction"), "down");
    expect(lastPlan()?.kpis).toMatchObject([{ id: "k1", direction: "down" }]);
  });

  it("emits the prototype as a click-dummy after its maturity is changed", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.click(screen.getByRole("radio", { name: "Click-dummy" }));
    expect(lastPlan()?.prototype).toMatchObject({ maturity: "click-dummy" });
  });

  it("links out to the agreed prototype at https://figma.test/checkout in a new tab", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByRole("link", { name: "Open prototype" }))
      .toHaveAttribute("href", PROTOTYPE_URL);
  });

  it("shows a read-only plan's fields as fields nobody can change", async () => {
    const { screen } = await renderPlan({ readOnly: true });
    await expect.element(screen.getByLabelText("Direction")).toBeDisabled();
  });

  it("renders a mockup through the host's renderMockup adapter", async () => {
    const { screen } = await renderPlan({
      adapters: {
        renderMockup: ({ format }: { format: string }) => (
          <p>host renders {format}</p>
        ),
      },
    });
    await expect.element(screen.getByText("host renders svg")).toBeVisible();
  });
});
