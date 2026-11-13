import { expect } from "vitest";
import type { PlanDocument } from "@re-cinq/planning-document";
import { askRefine } from "@re-cinq/planning-yjs";
import { blockText, writtenBlocks } from "@re-cinq/planning-document/testing";

import { createMemoryHub } from "../session/memory-hub.js";
import {
  CHECKOUT_PLAN,
  FIRST_TITLE,
  planSeed,
  renderAsAna,
} from "./fixtures.js";

export const EMPTY_PLAN = planSeed("performance");

export const renderEmpty = async (seed = EMPTY_PLAN) => {
  const rendered = await renderAsAna(seed);
  await expect
    .element(rendered.screen.getByRole("heading", { name: FIRST_TITLE }))
    .toBeVisible();

  return rendered;
};

export const REFINE_NOTE =
  "Nothing for the agent to refine yet. Answer a question in this section or resolve a comment, and Refine appears here.";

export const renderRefinable = async () => {
  const rendered = await renderAsAna(CHECKOUT_PLAN, {
    onRefine: () => Promise.resolve(),
  });
  const { screen } = rendered;
  await expect.element(screen.getByText(REFINE_NOTE).first()).toBeVisible();

  return rendered;
};

/** The intent's Refine button stays, disabled, while the agent refines another section. */
export const renderRefineBlocked = async () => {
  const hub = createMemoryHub(CHECKOUT_PLAN);
  const rendered = await renderAsAna(CHECKOUT_PLAN, {
    transport: hub.connect(),
    onRefine: () => Promise.resolve(),
  });
  askRefine(hub.doc, { slot: "kpis", askedBy: "Ben" });
  await expect.element(greyedRefineOf(rendered.screen)).toBeDisabled();

  return rendered;
};

export const pasteInto = (target: Element, text: string) => {
  const clipboardData = new DataTransfer();
  clipboardData.setData("text/plain", text);
  target.dispatchEvent(
    new ClipboardEvent("paste", { clipboardData, bubbles: true }),
  );
};

export const greyedRefineOf = (
  screen: Awaited<ReturnType<typeof renderAsAna>>["screen"],
) => screen.getByRole("button", { name: "Refine this section" }).first();

export const intentOf = (plan: PlanDocument | undefined) => {
  const [intent] = plan?.sections ?? [];
  const blocks = intent?.blocks ?? [];

  return {
    written: writtenBlocks(blocks),
    last: blocks.at(-1)?.type,
  };
};

export const intentText = (plan: PlanDocument | undefined) => {
  const { written } = intentOf(plan);

  return written.map(blockText).join();
};
