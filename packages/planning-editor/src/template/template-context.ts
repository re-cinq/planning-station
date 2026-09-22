import { createContext, useContext } from "react";
import {
  findSectionSlot,
  type PlanTemplate,
  type SectionSlot,
} from "@re-cinq/planning-document";

export const TemplateContext = createContext<PlanTemplate | null>(null);

/** Each section's title as its heading carries it, so a section the agent added goes by the title it gave. */
export const SectionTitlesContext = createContext<ReadonlyMap<string, string>>(
  new Map(),
);

export function useSlot(slot: string): SectionSlot | undefined {
  const template = useContext(TemplateContext);
  const title = useContext(SectionTitlesContext).get(slot);

  return template ? findSectionSlot(template, slot, title) : undefined;
}
