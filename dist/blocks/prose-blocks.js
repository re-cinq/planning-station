import { z } from "zod";
import { inlineContentSchema } from "./inline-text.js";
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
export function isProseBlockKind(type) {
    return PROSE_BLOCK_KINDS.includes(type);
}
function isAllowedHeading(block) {
    return (block.type !== "heading" ||
        PROSE_HEADING_LEVELS.includes(Number(block.props["level"])));
}
//# sourceMappingURL=prose-blocks.js.map