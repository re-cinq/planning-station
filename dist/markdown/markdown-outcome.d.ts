import type { AgentOp } from "../ops/agent-ops.js";
export declare const MARKDOWN_PROBLEM_CODES: readonly ["unknown-section", "duplicate-section", "renamed-template-section", "untitled-section", "invalid-fence", "unknown-fence"];
export type MarkdownProblemCode = (typeof MARKDOWN_PROBLEM_CODES)[number];
/** Something in plan.md that could not become an op; it is reported, never applied. */
export interface MarkdownProblem {
    code: MarkdownProblemCode;
    slot?: string;
    message: string;
}
export interface MarkdownOps {
    ops: AgentOp[];
    problems: MarkdownProblem[];
}
export declare const NO_CHANGE: MarkdownOps;
export declare function changed(op: AgentOp): MarkdownOps;
export declare function problem(code: MarkdownProblemCode, slot: string, message: string): MarkdownOps;
export declare function merged(outcomes: readonly MarkdownOps[]): MarkdownOps;
//# sourceMappingURL=markdown-outcome.d.ts.map