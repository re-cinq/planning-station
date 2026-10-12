import { type Problem } from "@re-cinq/planning-document";
export declare class UnauthorizedError extends Error {
}
/** RFC 9457 problem details, so a host answers plan errors like its own. */
export interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail: string;
    problems?: readonly Problem[];
}
export declare function toProblem(error: unknown): ProblemDetails;
//# sourceMappingURL=problem.d.ts.map