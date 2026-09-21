import { SectionChangedError, type Problem } from "@re-cinq/planning-document";

import { PlanNotApprovableError } from "../core/approval-error.js";
import { PlanNotFoundError } from "../core/errors.js";

const INVALID_REQUEST = 400;

const STATUS: Readonly<Record<string, number>> = {
  "plan-not-approvable": 409,
  "section-changed": 409,
  "plan-not-found": 404,
  unauthorized: 401,
  "invalid-request": INVALID_REQUEST,
};

export class UnauthorizedError extends Error {}

interface KnownError {
  error: new (message: string) => Error;
  type: string;
  title: string;
}

const KNOWN: readonly KnownError[] = [
  { error: PlanNotFoundError, type: "plan-not-found", title: "Plan not found" },
  {
    error: SectionChangedError,
    type: "section-changed",
    title: "The section changed since the agent read it",
  },
  { error: UnauthorizedError, type: "unauthorized", title: "Not allowed" },
];

/** RFC 9457 problem details, so a host answers plan errors like its own. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  problems?: readonly Problem[];
}

export function toProblem(error: unknown): ProblemDetails {
  const detail = error instanceof Error ? error.message : String(error);

  if (error instanceof PlanNotApprovableError) {
    return refusal(error, detail);
  }

  const known = KNOWN.find((candidate) => error instanceof candidate.error);

  return known
    ? problem(known.type, known.title, detail)
    : problem("invalid-request", "Invalid request", detail);
}

function refusal(
  error: PlanNotApprovableError,
  detail: string,
): ProblemDetails {
  return {
    ...problem("plan-not-approvable", "Plan is not ready for approval", detail),
    problems: error.report.problems,
  };
}

function problem(type: string, title: string, detail: string): ProblemDetails {
  return {
    type: `urn:planning:${type}`,
    title,
    status: STATUS[type] ?? INVALID_REQUEST,
    detail,
  };
}
