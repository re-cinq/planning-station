import { describe, it, expect } from "vitest";
import { userEvent, type Locator } from "vitest/browser";
import type { PlanDocument } from "@re-cinq/planning-document";

import { planSeed, renderAsAna, textBlock } from "../testing/fixtures.js";

const comment = (props: Record<string, unknown>, text: string) =>
  textBlock("comment", { at: "2026-09-18T09:12:00.000Z", ...props }, text);

const SEED = planSeed("feature", {
  intent: [
    textBlock("paragraph", {}, "Checkout feels slow on mobile."),
    comment({ commentId: "c1", author: "Ben" }, "Support tags this weekly."),
    comment(
      { commentId: "r1", replyTo: "c1", author: "Cleo" },
      "Only on mobile, though.",
    ),
    comment({ commentId: "r2", replyTo: "c1", author: "Dan" }, "Same here."),
  ],
});

const renderPlan = async () => {
  const editing = await renderAsAna(SEED);
  await expect
    .element(editing.screen.getByLabelText("Comment by Ben"))
    .toBeVisible();

  return editing;
};

const commentsIn = (plan: PlanDocument | undefined) => {
  const intent = plan?.sections.find((section) => section.slot === "intent");

  return intent?.blocks.filter((block) => block.type === "comment");
};

const isShown = (reply: Locator) => () => reply.query()?.checkVisibility();

const askToDelete = async (
  screen: Pick<Locator, "getByLabelText">,
  author: string,
) => {
  const own = screen.getByLabelText(`Comment by ${author}`);
  await userEvent.click(own.getByRole("button", { name: "Delete" }));

  return own.getByRole("dialog");
};

describe("CommentView", () => {
  it("files Ana's reply to Ben last in his thread, answering c1", async () => {
    const { screen, lastPlan } = await renderPlan();
    const thread = screen.getByLabelText("Comment by Ben");
    await userEvent.click(thread.getByRole("button", { name: "Reply" }));
    await userEvent.fill(screen.getByLabelText("Reply to Ben"), "Sending it.");
    await userEvent.keyboard("{Enter}");
    expect(commentsIn(lastPlan())).toMatchObject([
      { props: { commentId: "c1" } },
      { props: { commentId: "r1", replyTo: "c1" } },
      { props: { commentId: "r2", replyTo: "c1" } },
      { props: { replyTo: "c1", author: "Ana" } },
    ]);
  });

  it("marks c1 resolved and hides Cleo's reply when Ben's thread is resolved", async () => {
    const { screen, lastPlan } = await renderPlan();
    const thread = screen.getByLabelText("Comment by Ben");
    await userEvent.click(thread.getByRole("button", { name: "Resolve" }));
    expect(commentsIn(lastPlan())?.[0]).toMatchObject({
      props: { commentId: "c1", resolved: true },
    });
    const reply = screen.getByLabelText("Comment by Cleo");
    await expect.poll(isShown(reply)).toBeFalsy();
  });

  it("shows Cleo's reply again once the thread is reopened", async () => {
    const { screen } = await renderPlan();
    const thread = screen.getByLabelText("Comment by Ben");
    await userEvent.click(thread.getByRole("button", { name: "Resolve" }));
    await userEvent.click(thread.getByRole("button", { name: "Reopen" }));
    const reply = screen.getByLabelText("Comment by Cleo");
    await expect.poll(isShown(reply)).toBeTruthy();
  });

  it("deletes Cleo's reply only after confirming, leaving Ben's thread", async () => {
    const { screen, lastPlan } = await renderPlan();
    const popup = await askToDelete(screen, "Cleo");
    await expect.element(popup.getByText("Delete this comment?")).toBeVisible();
    await userEvent.click(popup.getByRole("button", { name: "Delete" }));
    await expect
      .poll(() => commentsIn(lastPlan()))
      .toMatchObject([
        { props: { commentId: "c1" } },
        { props: { commentId: "r2" } },
      ]);
  });

  it("deletes Ben's thread with both replies on confirm", async () => {
    const { screen, lastPlan } = await renderPlan();
    const popup = await askToDelete(screen, "Ben");
    await expect
      .element(popup.getByText("Delete this thread and its 2 replies?"))
      .toBeVisible();
    await userEvent.click(popup.getByRole("button", { name: "Delete" }));
    await expect.poll(() => commentsIn(lastPlan())).toEqual([]);
  });

  it("keeps the comment when the popup is cancelled", async () => {
    const { screen, lastPlan } = await renderPlan();
    const popup = await askToDelete(screen, "Cleo");
    await userEvent.click(popup.getByRole("button", { name: "Cancel" }));
    await expect.poll(() => popup.query()).toBeNull();
    await expect
      .element(screen.getByLabelText("Comment by Cleo"))
      .toBeVisible();
    expect(lastPlan()).toBeUndefined();
  });
});
