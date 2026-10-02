import {
  isRequiredAt,
  type PlanTemplate,
  type Section,
  type ValidationPhase,
} from "@re-cinq/planning-document";

export type PlanSectionHeading = Pick<Section, "slot" | "title">;

export interface OutlineSection {
  slot: string;
  title: string;
  required: boolean;
  /** Whether the plan holds this section, so there is a heading to go to. */
  inPlan: boolean;
}

/** The plan's sections in document order, the agent's own included, then any template section the plan lacks. */
export function outlineSections(
  template: PlanTemplate,
  sections: readonly PlanSectionHeading[],
  phase: ValidationPhase,
): OutlineSection[] {
  const present = new Set(sections.map((section) => section.slot));
  const missing = template.slots.filter((slot) => !present.has(slot.slot));

  return [...sections, ...missing].map((section) => ({
    ...outlineSection(template, section, phase),
    inPlan: present.has(section.slot),
  }));
}

// Only a template section can be required; a section the agent added never is.
function outlineSection(
  template: PlanTemplate,
  { slot, title }: PlanSectionHeading,
  phase: ValidationPhase,
): Omit<OutlineSection, "inPlan"> {
  const known = template.slots.find((candidate) => candidate.slot === slot);

  return {
    slot,
    title: title || known?.title || slot,
    required: known !== undefined && isRequiredAt(known.required, phase),
  };
}
