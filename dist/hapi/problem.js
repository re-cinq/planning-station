import { SectionChangedError } from "@re-cinq/planning-document";
import { PlanNotApprovableError } from "../core/approval-error.js";
import { PlanNotFoundError } from "../core/errors.js";
const INVALID_REQUEST = 400;
const STATUS = {
    "plan-not-approvable": 409,
    "section-changed": 409,
    "plan-not-found": 404,
    unauthorized: 401,
    "invalid-request": INVALID_REQUEST,
};
export class UnauthorizedError extends Error {
}
const KNOWN = [
    { error: PlanNotFoundError, type: "plan-not-found", title: "Plan not found" },
    {
        error: SectionChangedError,
        type: "section-changed",
        title: "The section changed since the agent read it",
    },
    { error: UnauthorizedError, type: "unauthorized", title: "Not allowed" },
];
export function toProblem(error) {
    const detail = error instanceof Error ? error.message : String(error);
    if (error instanceof PlanNotApprovableError) {
        return refusal(error, detail);
    }
    const known = KNOWN.find((candidate) => error instanceof candidate.error);
    return known
        ? problem(known.type, known.title, detail)
        : problem("invalid-request", "Invalid request", detail);
}
function refusal(error, detail) {
    return {
        ...problem("plan-not-approvable", "Plan is not ready for approval", detail),
        problems: error.report.problems,
    };
}
function problem(type, title, detail) {
    return {
        type: `urn:planning:${type}`,
        title,
        status: STATUS[type] ?? INVALID_REQUEST,
        detail,
    };
}
//# sourceMappingURL=problem.js.map