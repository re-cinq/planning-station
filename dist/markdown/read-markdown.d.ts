import type { ProseInput } from "../ops/prose-input.js";
import { type PlanFence } from "./markdown-syntax.js";
export interface Fence {
    tag: PlanFence;
    body: string;
    closed: boolean;
}
/** One `## ` section of plan.md: its heading, its prose and its fenced entities. */
export interface MarkdownSection {
    title: string;
    slot: string | null;
    prose: ProseInput[];
    fences: Fence[];
}
/** Reads plan.md in one pass; what precedes the first section, the plan's title included, is not read. */
export declare function readMarkdown(markdown: string): MarkdownSection[];
//# sourceMappingURL=read-markdown.d.ts.map