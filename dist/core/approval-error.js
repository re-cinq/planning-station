export class PlanNotApprovableError extends Error {
    report;
    constructor(message, report) {
        super(message);
        this.report = report;
    }
}
/** Carries the validation report to the caller that asked for approval. */
export function approvalError(report) {
    return (message) => new PlanNotApprovableError(message, report);
}
//# sourceMappingURL=approval-error.js.map