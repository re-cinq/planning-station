import { z } from "zod";
import { type InlineContent } from "../blocks/inline-text.js";
import { type ProseBlock } from "../blocks/prose-blocks.js";
/** Level 2 is a section in plan.md, so the agent's own headings sit one below it. */
export declare const AGENT_HEADING_LEVEL: number;
export declare const DEFAULT_CODE_LANGUAGE = "text";
type ListKind = "bulletListItem" | "numberedListItem";
/** One block of prose the agent writes; a list item nests the items under it. */
export type ProseInput = {
    type: "paragraph" | "quote";
    content: InlineContent;
} | {
    type: "heading";
    level: typeof AGENT_HEADING_LEVEL;
    content: InlineContent;
} | {
    type: "codeBlock";
    language: string;
    content: InlineContent;
} | {
    type: ListKind;
    content: InlineContent;
    children: ProseInput[];
} | {
    type: "checkListItem";
    checked?: boolean;
    content: InlineContent;
    children: ProseInput[];
} | {
    type: "table";
    rows: InlineContent[][];
};
export declare const proseInputSchema: z.ZodType<ProseInput>;
/** The blocks the agent's prose becomes, under ids its slot mints in order, so the same prose writes the same blocks. */
export declare function toProseBlocks(slot: string, inputs: readonly ProseInput[]): ProseBlock[];
export {};
//# sourceMappingURL=prose-input.d.ts.map