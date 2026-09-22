import { parseBlock, type BlockJson } from "../blocks/block-json.js";
import type { InlineContent } from "../blocks/inline-text.js";
import type { TableContent } from "../blocks/prose-blocks.js";
import { planWith } from "./plans.js";

type StyledText = Extract<InlineContent[number], { type: "text" }>;

interface ProseSpec {
  id: string;
  type: string;
  content: InlineContent | TableContent;
  props?: Record<string, unknown>;
  children?: ProseSpec[];
}

export function styledText(value: string, ...styles: string[]): StyledText {
  return {
    type: "text",
    text: value,
    styles: Object.fromEntries(styles.map((style) => [style, true])),
  };
}

const text = styledText;

const INTENT: readonly ProseSpec[] = [
  {
    id: "r-why",
    type: "heading",
    content: [text("Why now")],
    props: { level: 2 },
  },
  {
    id: "r-slow",
    type: "paragraph",
    content: [text("Checkout takes "), text("too long", "bold"), text(".")],
  },
];

const LISTS: readonly ProseSpec[] = [
  { id: "r-in", type: "paragraph", content: [text("In scope", "bold")] },
  {
    id: "r-lookup",
    type: "bulletListItem",
    content: [text("the "), text("price_lookup()", "code"), text(" call")],
    children: [
      {
        id: "r-cached",
        type: "bulletListItem",
        content: [text("cached", "italic"), text(" per market")],
      },
    ],
  },
  { id: "r-measure", type: "numberedListItem", content: [text("measure")] },
  {
    id: "r-ship",
    type: "numberedListItem",
    content: [text("ship "), text("v1", "strike")],
  },
  {
    id: "r-flag",
    type: "checkListItem",
    content: [text("flag exists")],
    props: { checked: true },
  },
  {
    id: "r-rollout",
    type: "checkListItem",
    content: [text("rollout plan")],
    props: { checked: false },
  },
];

const TABLE: TableContent = {
  type: "tableContent",
  rows: [
    { cells: [[text("Market")], [text("p95")]] },
    { cells: [[text("DE")], [text("200 ms")]] },
  ],
};

const BLOCKS: readonly ProseSpec[] = [
  { id: "r-quote", type: "quote", content: [text("Latency is the product.")] },
  {
    id: "r-code",
    type: "codeBlock",
    content: [text("const p95 = 200;\n## not a section")],
    props: { language: "ts" },
  },
  { id: "r-table", type: "table", content: TABLE },
  {
    id: "r-see",
    type: "paragraph",
    content: [
      text("See "),
      {
        type: "link",
        href: "https://example.com/adr",
        content: [text("the ADR")],
      },
      text(" before - 1. or *this*"),
    ],
  },
];

/** A feature plan whose prose uses every prose block and every mark plan.md writes, a level 2 heading and a nested list among them. */
export function richFeature(): BlockJson[] {
  return planWith("feature", {
    intent: INTENT.map(prose),
    scope: [...LISTS, ...BLOCKS].map(prose),
  });
}

function prose(spec: ProseSpec): BlockJson {
  const { props = {}, children = [], ...block } = spec;

  return parseBlock({ ...block, props, children: children.map(prose) });
}
