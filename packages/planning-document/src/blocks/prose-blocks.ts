import { z } from "zod";

import {
  inlineContentSchema,
  inlineFromText,
  type InlineContent,
} from "./inline-text.js";

export const PROSE_BLOCK_KINDS = [
  "paragraph",
  "heading",
  "bulletListItem",
  "numberedListItem",
  "checkListItem",
  "quote",
  "codeBlock",
  "table",
] as const;

export type ProseBlockKind = (typeof PROSE_BLOCK_KINDS)[number];

const tableContentSchema = z.looseObject({ type: z.literal("tableContent") });

export type TableContent = z.infer<typeof tableContentSchema>;

export type ProseBlock = {
  id: string;
  type: ProseBlockKind;
  props: Record<string, string | number | boolean>;
  content: InlineContent | TableContent;
  children: ProseBlock[];
};

export const PLAN_TITLE_LEVEL = 1;

export const PROSE_HEADING_LEVELS: readonly number[] = [
  PLAN_TITLE_LEVEL + 1,
  PLAN_TITLE_LEVEL + 2,
];

export const proseBlockSchema: z.ZodType<ProseBlock> = z.lazy(() =>
  z
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
    }),
) as z.ZodType<ProseBlock>;

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
export function tableCells(
  content: InlineContent | TableContent,
): InlineContent[][] {
  const { data: table } = tableRowsSchema.safeParse(content);

  return table ? table.rows.map((row) => row.cells) : [];
}

export function isProseBlockKind(type: string): type is ProseBlockKind {
  return (PROSE_BLOCK_KINDS as readonly string[]).includes(type);
}

function isAllowedHeading(block: {
  type: string;
  props: Record<string, unknown>;
}): boolean {
  return (
    block.type !== "heading" ||
    PROSE_HEADING_LEVELS.includes(Number(block.props["level"]))
  );
}
