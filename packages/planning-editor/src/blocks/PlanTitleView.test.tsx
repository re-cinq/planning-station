import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { PlanEditor } from "../PlanEditor.js";
import { editingAna, planSeed } from "../testing/fixtures.js";

const SEED = planSeed("feature");

const renderPlan = async () => {
  const editing = editingAna(SEED);
  const screen = await render(<PlanEditor {...editing.props} />);
  await expect.element(screen.getByRole("heading", { level: 1 })).toBeVisible();

  return { screen, lastPlan: editing.lastPlan };
};

describe("PlanTitleView", () => {
  it("shows the feature name as the plan's only level 1 heading", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Faster checkout");
  });

  it("renames the plan when the feature name is edited", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.click(screen.getByRole("heading", { level: 1 }));
    await userEvent.keyboard("{End} v2");
    expect(lastPlan()?.title).toEqual("Faster checkout v2");
  });

  it("keeps the section headings at level 2, under the feature name", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByRole("heading", { name: "What we want and why" }))
      .toBeVisible();
  });
});
