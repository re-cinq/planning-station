import { vi, type Mock } from "vitest";
import { render } from "vitest-browser-react";
import type { PlanDocument, PlanKind } from "@re-cinq/planning-document";
import {
  planMeta,
  planWith,
  type SectionContent,
} from "@re-cinq/planning-document/testing";

import { PlanEditor, type PlanEditorProps } from "../PlanEditor.js";
import { localTransport, type PlanSeed } from "../session/memory-hub.js";
import type { PlanUser } from "../session/plan-events.js";

export {
  planMeta,
  planWith,
  seededHeadings as seeded,
  textBlock,
} from "@re-cinq/planning-document/testing";

export const ANA: PlanUser = { id: "ana", name: "Ana", color: "#d33682" };
export const BEN: PlanUser = { id: "ben", name: "Ben", color: "#268bd2" };

export function planSeed(
  type: PlanKind,
  content: SectionContent = {},
): PlanSeed {
  return { meta: planMeta(type), blocks: planWith(type, content) };
}

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

/** Renders the plan as Ana would see it, and hands back what she changed. */
export async function renderAsAna(
  seed: PlanSeed,
  extra: Partial<PlanEditorProps> = {},
) {
  const editing = editingAna(seed);
  const screen = await render(<PlanEditor {...editing.props} {...extra} />);

  return { screen, lastPlan: editing.lastPlan };
}
