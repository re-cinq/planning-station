import type { PlanDocument } from "../plan/plan-document.js";
import { templateFor } from "../template/templates.js";
import type { Check, ValidationPhase, ValidationReport } from "./problems.js";
import {
  blockRequirements,
  disallowedBlocks,
  emptyRequiredSections,
  missingSections,
  sectionOrder,
  unknownSections,
} from "./section-checks.js";
import { prototypeMinimum } from "./prototype-check.js";

const CHECKS: readonly Check[] = [
  missingSections,
  unknownSections,
  sectionOrder,
  disallowedBlocks,
  emptyRequiredSections,
  blockRequirements,
  prototypeMinimum,
];

export function validatePlan(
  plan: PlanDocument,
  phase: ValidationPhase,
): ValidationReport {
  const template = templateFor(plan.type);
  const problems = CHECKS.flatMap((check) => check({ plan, template, phase }));

  return { passed: problems.length === 0, phase, problems };
}
