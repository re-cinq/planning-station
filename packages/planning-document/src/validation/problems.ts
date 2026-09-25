import type { PlanDocument } from "../plan/plan-document.js";
import type { PlanTemplate, SlotRequirement } from "../template/template.js";

export const VALIDATION_PHASES = ["draft", "approval"] as const;

export type ValidationPhase = (typeof VALIDATION_PHASES)[number];

export const PROBLEM_CODES = [
  "missing-section",
  "unknown-section",
  "section-out-of-order",
  "empty-required-section",
  "missing-block",
  "too-many-blocks",
  "disallowed-block",
  "prototype-below-minimum",
  "unresolved-finding",
] as const;

export type ProblemCode = (typeof PROBLEM_CODES)[number];

export interface Problem {
  code: ProblemCode;
  message: string;
  slot: string;
  blockId?: string;
}

export interface ValidationReport {
  passed: boolean;
  phase: ValidationPhase;
  problems: Problem[];
}

export interface CheckInput {
  plan: PlanDocument;
  template: PlanTemplate;
  phase: ValidationPhase;
}

export type Check = (input: CheckInput) => Problem[];

const REQUIREMENTS_BY_PHASE: Record<
  ValidationPhase,
  readonly SlotRequirement[]
> = {
  draft: ["always"],
  approval: ["always", "for-approval"],
};

export function isRequiredAt(
  requirement: SlotRequirement,
  phase: ValidationPhase,
): boolean {
  return REQUIREMENTS_BY_PHASE[phase].includes(requirement);
}

export function isAtLeast(
  phase: ValidationPhase,
  minimum: ValidationPhase,
): boolean {
  return VALIDATION_PHASES.indexOf(phase) >= VALIDATION_PHASES.indexOf(minimum);
}
