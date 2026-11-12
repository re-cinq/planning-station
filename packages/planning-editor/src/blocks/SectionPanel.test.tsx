import { describe, it, expect } from "vitest";

import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const SEED = planSeed("feature", {
  intent: [textBlock("paragraph", {}, "Checkout feels slow on mobile.")],
});

describe("SectionPanel", () => {
  it("draws nothing for a section, keeping the block type for stored plans", async () => {
    const { screen } = await renderAsAna(SEED);
    await expect
      .element(screen.getByRole("heading", { name: "What we want and why" }))
      .toBeVisible();

    expect(screen.container.querySelector("aside[data-slot]")).toBeNull();
  });
});
