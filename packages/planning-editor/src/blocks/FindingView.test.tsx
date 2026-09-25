import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import type { PlanDocument } from "@re-cinq/planning-document";

import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const FINDING_TEXT = "The plan promises Danish status labels but names none";
const WHY = "FR-166 keys the card on fixed text";

const finding = textBlock(
  "finding",
  { findingId: "f1", severity: "blocker", why: WHY, resolved: false },
  FINDING_TEXT,
);

const SEED = planSeed("feature", { intent: [finding] });

const findingsIn = (plan: PlanDocument | undefined) => {
  const intent = plan?.sections.find((section) => section.slot === "intent");

  return intent?.blocks.filter((block) => block.type === "finding");
};

describe("FindingView", () => {
  it("resolves the blocker finding when Resolve is clicked", async () => {
    const { screen, lastPlan } = await renderAsAna(SEED);
    const card = screen.getByLabelText("Finding · blocker");
    await expect.element(card).toBeVisible();
    await expect.element(screen.getByText(FINDING_TEXT)).toBeVisible();
    await expect.element(screen.getByText(WHY)).toBeVisible();

    await userEvent.click(card.getByRole("button", { name: "Resolve" }));

    expect({
      finding: findingsIn(lastPlan())?.[0],
      resolved: card.element().getAttribute("data-resolved"),
    }).toMatchObject({
      finding: { props: { findingId: "f1", resolved: true } },
      resolved: "true",
    });
  });
});
