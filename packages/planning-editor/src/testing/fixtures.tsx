import { expect, vi, type Mock } from "vitest";
import { render } from "vitest-browser-react";
import type { PlanDocument, PlanKind } from "@re-cinq/planning-document";
import {
  planMeta,
  planWith,
  textBlock,
  type SectionContent,
} from "@re-cinq/planning-document/testing";

import { PlanEditor, type PlanEditorProps } from "../PlanEditor.js";
import {
  createMemoryHub,
  localTransport,
  type PlanSeed,
} from "../session/memory-hub.js";
import type { PlanTransport, PlanUser } from "../session/plan-events.js";

export {
  planMeta,
  planWith,
  seededHeadings as seeded,
  textBlock,
} from "@re-cinq/planning-document/testing";

export const ANA: PlanUser = { id: "ana", name: "Ana" };
export const BEN: PlanUser = { id: "ben", name: "Ben" };

export function planSeed(
  type: PlanKind,
  content: SectionContent = {},
): PlanSeed {
  return { meta: planMeta(type), blocks: planWith(type, content) };
}

/** A performance plan whose intent reads "Checkout" and whose success criteria read "Targets". */
export const CHECKOUT_PLAN = planSeed("performance", {
  intent: [textBlock("paragraph", {}, "Checkout")],
  kpis: [textBlock("paragraph", {}, "Targets")],
});
export const FIRST_TITLE = "What we want and why";

export function lastCallOf<T>(callback: Mock<(value: T) => void>) {
  const [latest] = callback.mock.lastCall ?? [];

  return latest;
}

export function editingAna(seed: PlanSeed) {
  const onChange = vi.fn<(plan: PlanDocument) => void>();

  return {
    props: { transport: localTransport(seed), user: ANA, onChange },
    lastPlan: () => lastCallOf(onChange),
  };
}

/** Ana and Ben on one plan, each in their own editor region; Ana can leave while Ben stays. */
export async function renderPair(seed: PlanSeed) {
  const hub = createMemoryHub(seed);
  const [anaEditor, benEditor] = [
    editorOf(ANA, hub.connect()),
    editorOf(BEN, hub.connect()),
  ];
  const screen = await render(
    <>
      {anaEditor}
      {benEditor}
    </>,
  );
  const ana = screen.getByRole("region", { name: "Ana's editor" });
  const ben = screen.getByRole("region", { name: "Ben's editor" });
  await expect.element(ana.getByRole("heading").first()).toBeVisible();
  await expect.element(ben.getByRole("heading").first()).toBeVisible();

  return { ana, ben, anaLeaves: () => screen.rerender(<>{benEditor}</>) };
}

function editorOf(user: PlanUser, transport: PlanTransport) {
  return (
    <section key={user.id} aria-label={`${user.name}'s editor`}>
      <PlanEditor transport={transport} user={user} showOutline={false} />
    </section>
  );
}

/** Renders the plan as Ana would see it, and hands back what she changed. */
export async function renderAsAna(
  seed: PlanSeed,
  extra: Partial<PlanEditorProps> = {},
) {
  const editing = editingAna(seed);
  const screen = await render(<PlanEditor {...editing.props} {...extra} />);

  return { screen, lastPlan: editing.lastPlan };
}
