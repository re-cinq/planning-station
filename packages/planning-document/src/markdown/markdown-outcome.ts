import type { AgentOp } from "../ops/agent-ops.js";

export const MARKDOWN_PROBLEM_CODES = [
  "unknown-section",
  "duplicate-section",
  "renamed-template-section",
  "untitled-section",
  "invalid-fence",
] as const;

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

export const NO_CHANGE: MarkdownOps = { ops: [], problems: [] };

export function changed(...ops: AgentOp[]): MarkdownOps {
  return { ops, problems: [] };
}

export function problem(
  code: MarkdownProblemCode,
  slot: string,
  message: string,
): MarkdownOps {
  return { ops: [], problems: [{ code, slot, message }] };
}

export function merged(outcomes: readonly MarkdownOps[]): MarkdownOps {
  return {
    ops: outcomes.flatMap((outcome) => outcome.ops),
    problems: outcomes.flatMap((outcome) => outcome.problems),
  };
}
