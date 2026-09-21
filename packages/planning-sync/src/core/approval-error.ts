import type { ValidationReport } from "@re-cinq/planning-document";

export class PlanNotApprovableError extends Error {
  constructor(
    message: string,
    readonly report: ValidationReport,
  ) {
    super(message);
  }
}

/** Carries the validation report to the caller that asked for approval. */
export function approvalError(report: ValidationReport) {
  return (message: string) => new PlanNotApprovableError(message, report);
}
