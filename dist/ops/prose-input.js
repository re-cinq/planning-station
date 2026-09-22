import { z } from "zod";
import { inlineContentSchema, inlineFromText, plainText, } from "../blocks/inline-text.js";
import { PLAN_TITLE_LEVEL, } from "../blocks/prose-blocks.js";
/** Level 2 is a section in plan.md, so the agent's own headings sit one below it. */
export const AGENT_HEADING_LEVEL = PLAN_TITLE_LEVEL + 2;
export const DEFAULT_CODE_LANGUAGE = "text";
const content = inlineContentSchema.default([]);
const textSchema = z.object({ type: z.enum(["paragraph", "quote"]), content });
const headingSchema = z.object({
    type: z.literal("heading"),
    level: z.literal(AGENT_HEADING_LEVEL).default(AGENT_HEADING_LEVEL),
    content,
});
const codeSchema = z.object({
    type: z.literal("codeBlock"),
    language: z.string().min(1).default(DEFAULT_CODE_LANGUAGE),
    content,
});
const tableSchema = z.object({
    type: z.literal("table"),
    rows: z.array(z.array(inlineContentSchema)),
});
export const proseInputSchema = z.lazy(() => {
    const children = z.array(proseInputSchema).default([]);
    return z.discriminatedUnion("type", [
        textSchema,
        headingSchema,
        codeSchema,
        tableSchema,
        z.object({
            type: z.enum(["bulletListItem", "numberedListItem"]),
            content,
            children,
        }),
        z.object({
            type: z.literal("checkListItem"),
            checked: z.boolean().optional(),
            content,
            children,
        }),
    ]);
});
/** The blocks the agent's prose becomes, under ids its slot mints in order, so the same prose writes the same blocks. */
export function toProseBlocks(slot, inputs) {
    return inputs.map((input, index) => proseBlock(input, `${slot}-p-${index + 1}`));
}
function proseBlock(input, id) {
    const children = "children" in input ? input.children : [];
    return {
        id,
        type: input.type,
        props: propsOf(input),
        content: contentOf(input),
        children: children.map((child, index) => proseBlock(child, `${id}-${index + 1}`)),
    };
}
function propsOf(input) {
    if (input.type === "heading") {
        return { level: input.level };
    }
    if (input.type === "checkListItem") {
        return { checked: input.checked === true };
    }
    return input.type === "codeBlock" ? { language: input.language } : {};
}
function contentOf(input) {
    if (input.type === "table") {
        return {
            type: "tableContent",
            headerRows: 1,
            rows: input.rows.map((cells) => ({ cells })),
        };
    }
    return input.type === "codeBlock"
        ? inlineFromText(plainText(input.content))
        : input.content;
}
//# sourceMappingURL=prose-input.js.map