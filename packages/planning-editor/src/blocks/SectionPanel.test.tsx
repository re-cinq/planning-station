import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import type { PlanDocument } from "@re-cinq/planning-document";

import type { PlanEditorProps } from "../PlanEditor.js";
import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const SEED = planSeed("feature", {
  intent: [textBlock("paragraph", {}, "Checkout feels slow on mobile.")],
  questions: [
    textBlock(
      "question",
      {
        questionId: "q1",
        why: "the agent needs one number",
        kind: "choice",
        options: "200 ms, 150 ms",
      },
      "How fast must the price step be?",
    ),
  ],
});

const INTENT_COMMENT = "Comment on What we want and why";

const renderPlan = async (extra: Partial<PlanEditorProps> = {}) => {
  const editing = await renderAsAna(SEED, extra);
  await expect
    .element(editing.screen.getByLabelText(INTENT_COMMENT))
    .toBeVisible();

  return editing;
};

const sectionOf = (plan: PlanDocument | undefined, slot: string) =>
  plan?.sections.find((section) => section.slot === slot);

describe("SectionPanel", () => {
  it("gives every section its own comment box", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByLabelText("Comment on Success criteria"))
      .toBeVisible();
  });

  it("puts a comment in the section it was written under, with its author", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.fill(
      screen.getByLabelText(INTENT_COMMENT),
      "Is this still true?",
    );
    await userEvent.keyboard("{Enter}");
    expect(sectionOf(lastPlan(), "intent")?.blocks).toMatchObject([
      { type: "comment", props: { author: "Ana" } },
      { type: "section-panel" },
      { type: "paragraph" },
      { type: "section-actions" },
    ]);
  });
});
