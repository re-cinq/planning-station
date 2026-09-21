import { z } from "zod";
import { type InlineContent } from "./inline-text.js";
export declare const PROSE_BLOCK_KINDS: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
export type ProseBlockKind = (typeof PROSE_BLOCK_KINDS)[number];
declare const tableContentSchema: z.ZodObject<{
    type: z.ZodLiteral<"tableContent">;
}, z.core.$loose>;
export type TableContent = z.infer<typeof tableContentSchema>;
export type ProseBlock = {
    id: string;
    type: ProseBlockKind;
    props: Record<string, string | number | boolean>;
    content: InlineContent | TableContent;
    children: ProseBlock[];
};
export declare const PLAN_TITLE_LEVEL = 1;
export declare const PROSE_HEADING_LEVELS: readonly number[];
export declare const proseBlockSchema: z.ZodType<ProseBlock>;
export declare function isProseBlockKind(type: string): type is ProseBlockKind;
export {};
//# sourceMappingURL=prose-blocks.d.ts.map