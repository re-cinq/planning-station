import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import type { PlanDocument } from "@re-cinq/planning-document";

import "../styles/theme.scss";
import type { PlanEditorProps } from "../PlanEditor.js";
import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const SEED = planSeed("feature", {
  intent: [textBlock("paragraph", {}, "Checkout feels slow on mobile.")],
});

const OPEN_COMMENT = { name: "Comment on What we want and why" };
const TRANSPARENT = /^(transparent|rgba\(\d+, \d+, \d+, 0\))$/;
const CLOSE_COMMENT = { name: "Close comment on What we want and why" };

const renderPlan = async (extra: Partial<PlanEditorProps> = {}) => {
  const editing = await renderAsAna(SEED, extra);
  await expect
    .element(
      editing.screen.getByRole("heading", { name: "What we want and why" }),
    )
    .toBeVisible();

  return editing;
};

type Screen = Awaited<ReturnType<typeof renderPlan>>["screen"];

const openComposer = async (screen: Screen) => {
  await userEvent.click(screen.getByRole("button", OPEN_COMMENT));

  return screen.getByRole("textbox", OPEN_COMMENT);
};

const intentBlockTypes = (plan: PlanDocument | undefined) => {
  const intent = plan?.sections.find((section) => section.slot === "intent");

  return (intent?.blocks ?? []).map((block) => block.type);
};

describe("SectionHeading comment composer", () => {
  it("shows no comment input until Comment is pressed", async () => {
    const { screen } = await renderPlan();
    expect(screen.getByRole("textbox", OPEN_COMMENT).query()).toBeNull();

    const input = await openComposer(screen);

    await expect.element(input).toHaveFocus();
  });

  it("inserts a comment by Ana after the heading and closes the composer", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.fill(await openComposer(screen), "Is this still true?");
    await userEvent.keyboard("{Enter}");

    expect(intentBlockTypes(lastPlan())).toEqual([
      "comment",
      "section-panel",
      "paragraph",
      "section-actions",
    ]);
    await expect
      .poll(() => screen.getByRole("textbox", OPEN_COMMENT).query())
      .toBeNull();
  });

  it("inserts nothing for a comment of only spaces", async () => {
    const { screen, lastPlan } = await renderPlan();
    const input = await openComposer(screen);
    await userEvent.fill(input, "   ");
    await userEvent.keyboard("{Enter}");

    expect(intentBlockTypes(lastPlan())).not.toContain("comment");
    await expect.element(input).toBeVisible();
  });

  it("closes the composer on Escape", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.fill(await openComposer(screen), "never mind");
    await userEvent.keyboard("{Escape}");

    await expect
      .poll(() => screen.getByRole("textbox", OPEN_COMMENT).query())
      .toBeNull();
    expect(intentBlockTypes(lastPlan())).not.toContain("comment");
  });

  it("offers no Comment button in a read-only plan", async () => {
    const { screen } = await renderPlan({ readOnly: true });

    expect(screen.getByRole("button", OPEN_COMMENT).query()).toBeNull();
  });

  it("labels the Comment button Close comment while the composer is open", async () => {
    const { screen } = await renderPlan();
    await openComposer(screen);

    await expect
      .element(screen.getByRole("button", CLOSE_COMMENT))
      .toHaveAttribute("aria-expanded", "true");
  });

  it("draws the Comment button with a border before it is hovered", async () => {
    const { screen } = await renderPlan();
    await userEvent.unhover(screen.getByRole("button", OPEN_COMMENT));
    const button = screen.getByRole("button", OPEN_COMMENT).element();
    const { borderTopStyle, borderTopColor } = getComputedStyle(button);

    expect({ borderTopStyle, borderTopColor }).toEqual({
      borderTopStyle: "solid",
      borderTopColor: expect.not.stringMatching(TRANSPARENT),
    });
  });
});
