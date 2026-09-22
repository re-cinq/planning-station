import type { PlanDocument } from "../plan/plan-document.js";
import type { PlanTemplate, SlotRequirement } from "../template/template.js";
export declare const VALIDATION_PHASES: readonly ["draft", "approval"];
export type ValidationPhase = (typeof VALIDATION_PHASES)[number];
export declare const PROBLEM_CODES: readonly ["missing-section", "unknown-section", "section-out-of-order", "empty-required-section", "missing-block", "too-many-blocks", "disallowed-block", "prototype-below-minimum"];
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
export declare function isRequiredAt(requirement: SlotRequirement, phase: ValidationPhase): boolean;
export declare function isAtLeast(phase: ValidationPhase, minimum: ValidationPhase): boolean;
//# sourceMappingURL=problems.d.ts.map