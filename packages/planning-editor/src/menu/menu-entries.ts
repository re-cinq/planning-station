import { newId, type BlockKind } from "@re-cinq/planning-document";

import { questionAt, type MenuBlock } from "./section-context.js";

export interface InsertContext {
  blocks: readonly MenuBlock[];
  cursorId: string;
}

type Props = Record<string, unknown>;

export interface MenuEntry {
  kind: BlockKind;
  title: string;
  group: string;
  aliases?: readonly string[];
  props?: (context: InsertContext) => Props | null;
  content?: unknown;
}

const TEXT = "Text";
const PLAN = "Plan";

const EMPTY_ROW = { cells: ["", "", ""] };

/** An answer belongs to the question above it, and needs one to exist. */
const answering = (context: InsertContext): Props | null => {
  const questionId = questionAt(context.blocks, context.cursorId);

  return questionId ? { questionId } : null;
};

export const MENU_ENTRIES: readonly MenuEntry[] = [
  { kind: "paragraph", title: "Paragraph", group: TEXT, aliases: ["p"] },
  {
    kind: "heading",
    title: "Heading",
    group: TEXT,
    aliases: ["h2"],
    props: () => ({ level: 2 }),
  },
  {
    kind: "heading",
    title: "Subheading",
    group: TEXT,
    aliases: ["h3"],
    props: () => ({ level: 3 }),
  },
  {
    kind: "bulletListItem",
    title: "Bullet list",
    group: TEXT,
    aliases: ["ul"],
  },
  {
    kind: "numberedListItem",
    title: "Numbered list",
    group: TEXT,
    aliases: ["ol"],
  },
  { kind: "checkListItem", title: "Checklist", group: TEXT, aliases: ["todo"] },
  { kind: "quote", title: "Quote", group: TEXT },
  { kind: "codeBlock", title: "Code", group: TEXT },
  {
    kind: "table",
    title: "Table",
    group: TEXT,
    content: { type: "tableContent", rows: [EMPTY_ROW, EMPTY_ROW] },
  },
  {
    kind: "kpi",
    title: "KPI",
    group: PLAN,
    aliases: ["metric", "success"],
    props: () => ({ kpiId: newId("kpi") }),
  },
  { kind: "prototype", title: "Prototype", group: PLAN },
  { kind: "mockup", title: "Mockup", group: PLAN },
  {
    kind: "question",
    title: "Question",
    group: PLAN,
    props: () => ({ questionId: newId("q") }),
  },
  { kind: "answer", title: "Answer", group: PLAN, props: answering },
];
