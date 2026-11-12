import type { Problem } from "@re-cinq/planning-document";

import type { OutlineSection } from "./outline-sections.js";

export type SectionState = "ready" | "problem" | "missing";

export interface SectionRow {
  section: OutlineSection;
  problems: readonly Problem[];
}

export interface RequiredProgress {
  ready: number;
  total: number;
}

export function sectionState(
  section: OutlineSection,
  problems: readonly Problem[],
): SectionState {
  if (problems.length > 0) {
    return "problem";
  }

  return section.inPlan ? "ready" : "missing";
}

export function requiredProgress(
  rows: readonly SectionRow[],
): RequiredProgress {
  const required = rows.filter(({ section }) => section.required);
  const ready = required.filter(
    ({ section, problems }) => sectionState(section, problems) === "ready",
  );

  return { ready: ready.length, total: required.length };
}
