import { describe, it, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { PlanEditorProps } from "../PlanEditor.js";
import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const SEED = planSeed("feature", {
  kpis: [
    textBlock("question", { questionId: "q-target" }, "Is 400 ms enough?"),
    textBlock("answer", { questionId: "q-target" }, "300 ms"),
  ],
  questions: [
    textBlock(
      "question",
      { questionId: "q1", why: "the agent needs one number", kind: "text" },
      "How fast must the price step be?",
    ),
  ],
});

const renderPlan = async (extra: Partial<PlanEditorProps> = {}) => {
  const editing = await renderAsAna(SEED, extra);
  await expect
    .element(editing.screen.getByLabelText("Comment on Success criteria"))
    .toBeVisible();

  return editing;
};

describe("SectionActions", () => {
  it("asks the host to refine only the section whose button was pressed", async () => {
    const onRefine = vi.fn(() => Promise.resolve());
    const { screen } = await renderPlan({ onRefine });
    await userEvent.click(
      screen
        .getByLabelText("Success criteria actions")
        .getByRole("button", { name: "Refine this section" }),
    );
    expect(onRefine).toHaveBeenCalledWith(
      expect.objectContaining({ slot: "kpis", title: "Success criteria" }),
    );
  });

  it("puts Refine under the section's questions", async () => {
    const { screen } = await renderPlan({ onRefine: vi.fn() });
    const question = screen.getByText("How fast must the price step be?");
    const refine = screen
      .getByLabelText("Open questions actions")
      .getByRole("button", { name: "Refine this section" });
    expect(question.element().compareDocumentPosition(refine.element())).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("offers no Refine button when the host has nothing to refine with", async () => {
    const { screen } = await renderPlan();
    expect(
      screen.container.querySelectorAll("button[class*='refine']"),
    ).toHaveLength(0);
  });
});

describe("SectionActions remove", () => {
  const removeButton = (
    screen: Awaited<ReturnType<typeof renderPlan>>["screen"],
    title: string,
  ) =>
    screen
      .getByLabelText(`${title} actions`)
      .getByRole("button", { name: `Remove section ${title}` });

  it("offers Remove on Prototype and not on the always-required intent", async () => {
    const { screen } = await renderPlan();
    await expect.element(removeButton(screen, "Prototype")).toBeVisible();
    expect(removeButton(screen, "What we want and why").query()).toBeNull();
  });

  it("keeps Prototype when Ana cancels the removal", async () => {
    const { screen } = await renderPlan();
    await userEvent.click(removeButton(screen, "Prototype"));
    const dialog = screen.getByRole("dialog", { name: "Remove Prototype?" });
    await userEvent.click(dialog.getByRole("button", { name: "Cancel" }));
    await expect.poll(() => dialog.query()).toBeNull();
    await expect.element(removeButton(screen, "Prototype")).toBeVisible();
  });

  it("removes Prototype on confirm, and the outline no longer lists it", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.click(removeButton(screen, "Prototype"));
    const dialog = screen.getByRole("dialog", { name: "Remove Prototype?" });
    await userEvent.click(dialog.getByRole("button", { name: "Remove" }));
    const listed = screen
      .getByRole("navigation", { name: "Plan outline" })
      .getByRole("listitem", { name: "Prototype", exact: true });
    await expect.poll(() => lastPlan()?.droppedSlots).toEqual(["prototype"]);
    expect({
      actions: screen.getByLabelText("Prototype actions").query(),
      listed: listed.query(),
    }).toEqual({ actions: null, listed: null });
  });
});
