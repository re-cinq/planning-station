import { z } from "zod";
import { inlineContentSchema, inlineFromText, } from "./inline-text.js";
export const PROSE_BLOCK_KINDS = [
    "paragraph",
    "heading",
    "bulletListItem",
    "numberedListItem",
    "checkListItem",
    "quote",
    "codeBlock",
    "table",
];
const tableContentSchema = z.looseObject({ type: z.literal("tableContent") });
export const PLAN_TITLE_LEVEL = 1;
export const PROSE_HEADING_LEVELS = [
    PLAN_TITLE_LEVEL + 1,
    PLAN_TITLE_LEVEL + 2,
];
export const proseBlockSchema = z.lazy(() => z
    .object({
    id: z.string(),
    type: z.enum(PROSE_BLOCK_KINDS),
    props: z
        .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
        .default({}),
    content: z.union([inlineContentSchema, tableContentSchema]).default([]),
    children: z.array(proseBlockSchema).default([]),
})
    .refine(isAllowedHeading, {
    message: `a heading is level ${PROSE_HEADING_LEVELS.join(" or ")}; level ${PLAN_TITLE_LEVEL} is the plan title`,
    path: ["props", "level"],
}));
// The editor writes a cell as a string, an inline array or a tableCell holding one.
const tableCellSchema = z.union([
    z.string().transform(inlineFromText),
    inlineContentSchema,
    z.object({ content: inlineContentSchema }).transform((cell) => cell.content),
]);
const tableRowsSchema = z.object({
    rows: z.array(z.object({ cells: z.array(tableCellSchema) })),
});
/** A table's cells, row by row, each as its inline content; content that is not a table has none. */
export function tableCells(content) {
    const { data: table } = tableRowsSchema.safeParse(content);
    return table ? table.rows.map((row) => row.cells) : [];
}
export function isProseBlockKind(type) {
    return PROSE_BLOCK_KINDS.includes(type);
}
function isAllowedHeading(block) {
    return (block.type !== "heading" ||
        PROSE_HEADING_LEVELS.includes(Number(block.props["level"])));
}
//# sourceMappingURL=prose-blocks.js.map