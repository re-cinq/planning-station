import { plainText, type InlineContent } from "../blocks/inline-text.js";
import { tableCells, type ProseBlock } from "../blocks/prose-blocks.js";
import { DEFAULT_CODE_LANGUAGE } from "../ops/prose-input.js";
import { renderInline } from "./inline-render.js";
import {
  escapeBlockStart,
  listMarker,
  quoteLine,
  type ListKind,
} from "./markdown-syntax.js";

type Render = (block: ProseBlock, number: number) => string[];

const FENCE_MIN = 3;
const HEADING_MARKER = "###";
const LEADING_BACKTICKS = /^\s*(`*)/;
const TABLE_RULE = "---";

const LIST_KINDS: readonly string[] = [
  "bulletListItem",
  "numberedListItem",
  "checkListItem",
] satisfies ListKind[];

// Nothing to write: an empty paragraph, heading or quote reads back as no block at all.
const TEXT_ONLY: readonly string[] = ["paragraph", "heading", "quote"];

const RENDERERS: Record<ProseBlock["type"], Render> = {
  paragraph: (block) => textLines(inlineOf(block)),
  heading: (block) => [`${HEADING_MARKER} ${oneLine(inlineOf(block))}`],
  quote: (block) => textLines(inlineOf(block)).map(quoteLine),
  codeBlock: codeLines,
  table: (block) => tableLines(tableCells(block.content)),
  bulletListItem: listLines,
  numberedListItem: listLines,
  checkListItem: listLines,
};

/** A section's prose as Markdown lines: blocks parted by blank lines, list items kept together and numbered in order. */
export function writeProse(blocks: readonly ProseBlock[]): string[] {
  const written = writtenBlocks(blocks);
  const numbers = listNumbers(written);
  const rendered = written
    .map((block, at) => ({
      block,
      lines: RENDERERS[block.type](block, numbers[at] ?? 0),
    }))
    .filter(({ lines }) => lines.length > 0);

  return rendered.flatMap(({ block, lines }, at) => {
    const previous = rendered[at - 1]?.block;
    const together = previous && isListItem(previous) && isListItem(block);

    return previous && !together ? ["", ...lines] : lines;
  });
}

/** Markdown nests blocks only under list items, so what nests under any other block follows it; empty text blocks write nothing. */
function writtenBlocks(blocks: readonly ProseBlock[]): ProseBlock[] {
  return blocks.flatMap(hoisted).filter(hasText);
}

function hoisted(block: ProseBlock): ProseBlock[] {
  return isListItem(block)
    ? [block]
    : [{ ...block, children: [] }, ...block.children.flatMap(hoisted)];
}

function hasText(block: ProseBlock): boolean {
  return (
    !TEXT_ONLY.includes(block.type) || plainText(inlineOf(block)).trim() !== ""
  );
}

function isListItem(block: ProseBlock): boolean {
  return LIST_KINDS.includes(block.type);
}

/** Each numbered item counts on from the one before it; any other block restarts the count. */
function listNumbers(blocks: readonly ProseBlock[]): number[] {
  let count = 0;

  return blocks.map((block) => {
    count = block.type === "numberedListItem" ? count + 1 : 0;

    return count;
  });
}

function inlineOf(block: ProseBlock): InlineContent {
  return Array.isArray(block.content) ? block.content : [];
}

/** Each line of the text, trimmed, and escaped where it would read as a block. */
function textLines(content: InlineContent): string[] {
  return renderInline(content)
    .split("\n")
    .map((line) => escapeBlockStart(line.trim()));
}

function oneLine(content: InlineContent): string {
  return renderInline(content).replaceAll("\n", " ").trim();
}

function listLines(block: ProseBlock, number: number): string[] {
  const type = block.type as ListKind;
  const checked = block.props["checked"] === true;
  const marker = listMarker({ type, checked }, number);
  const indent = " ".repeat(
    type === "numberedListItem" ? marker.length + 1 : 2,
  );
  const [first = "", ...rest] = textLines(inlineOf(block));
  const children = writeProse(block.children);
  const [firstChild] = writtenBlocks(block.children);
  const gap = firstChild && !isListItem(firstChild) ? [""] : [];
  const indented = (line: string) => (line === "" ? line : indent + line);

  return [
    first === "" ? marker : `${marker} ${first}`,
    ...rest.map(indented),
    ...gap,
    ...children.map(indented),
  ];
}

function codeLines(block: ProseBlock): string[] {
  const code = plainText(inlineOf(block));
  const lines = code === "" ? [] : code.split("\n");
  const longest = Math.max(0, ...lines.map(leadingBackticks));
  const fence = "`".repeat(Math.max(FENCE_MIN, longest + 1));
  const language = String(block.props["language"] ?? DEFAULT_CODE_LANGUAGE);
  const tag = language === DEFAULT_CODE_LANGUAGE ? "" : language;

  return [`${fence}${tag}`, ...lines, fence];
}

function leadingBackticks(line: string): number {
  const [, backticks = ""] = LEADING_BACKTICKS.exec(line) ?? [];

  return backticks.length;
}

/** A GFM table: its first row is the header, and every row is padded to the widest. */
function tableLines(rows: readonly InlineContent[][]): string[] {
  const width = Math.max(0, ...rows.map((cells) => cells.length));
  const [header, ...body] = rows.map((cells) =>
    [...cells, ...emptyCells(width - cells.length)].map(cellMarkup),
  );

  if (!header || width === 0) {
    return [];
  }

  return [header, header.map(() => TABLE_RULE), ...body].map(
    (cells) => `| ${cells.join(" | ")} |`,
  );
}

function emptyCells(count: number): InlineContent[] {
  return Array.from({ length: count }, () => []);
}

function cellMarkup(content: InlineContent): string {
  return oneLine(content).replaceAll("|", "\\|");
}
