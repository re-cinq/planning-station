import { createContext, useContext } from "react";
import type { PlanTemplate, SectionSlot } from "@re-cinq/planning-document";

export const TemplateContext = createContext<PlanTemplate | null>(null);

export function useSlot(slot: string): SectionSlot | undefined {
  const template = useContext(TemplateContext);

  return template?.slots.find((candidate) => candidate.slot === slot);
}
