import type { ValidationReport } from "@re-cinq/planning-document";
export declare class PlanNotApprovableError extends Error {
    readonly report: ValidationReport;
    constructor(message: string, report: ValidationReport);
}
/** Carries the validation report to the caller that asked for approval. */
export declare function approvalError(report: ValidationReport): (message: string) => PlanNotApprovableError;
//# sourceMappingURL=approval-error.d.ts.map