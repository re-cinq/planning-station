import { inlineFromText, type InlineContent } from "../blocks/inline-text.js";
import {
  AGENT_HEADING_LEVEL,
  DEFAULT_CODE_LANGUAGE,
  type ProseInput,
} from "../ops/prose-input.js";
import { parseInline } from "./inline-parse.js";
import {
  closesFence,
  fenceOpening,
  headingText,
  indentOf,
  isQuote,
  isTableRow,
  isTableSeparator,
  listLine,
  quoteText,
  startsBlock,
  type ListLine,
} from "./markdown-syntax.js";

/** Where the reading has got to in a run of prose lines. */
interface Cursor {
  lines: readonly string[];
  at: number;
}

type BlockReader = (cursor: Cursor, body: string) => ProseInput | null;

/** A nested item sits at least this far right of its parent's marker. */
const CHILD_INDENT = 2;

const READERS: readonly BlockReader[] = [
  readCode,
  readHeading,
  readQuote,
  readTable,
  readListItem,
];

/** A section's prose lines as blocks: paragraphs, subheadings, nested lists, quotes, code and tables. */
export function readProse(lines: readonly string[]): ProseInput[] {
  const cursor: Cursor = { lines, at: 0 };
  const blocks: ProseInput[] = [];

  while (cursor.at < lines.length) {
    const block = readBlock(cursor);

    if (block) {
      blocks.push(block);
    }
  }

  return blocks;
}

function readBlock(cursor: Cursor): ProseInput | null {
  const line = lineAt(cursor) ?? "";

  if (isBlank(line)) {
    cursor.at += 1;

    return null;
  }

  const body = line.trimStart();

  for (const reader of READERS) {
    const block = reader(cursor, body);

    if (block) {
      return block;
    }
  }

  return readParagraph(cursor, body);
}

function lineAt(cursor: Cursor, offset = 0): string | undefined {
  return cursor.lines[cursor.at + offset];
}

function isBlank(line: string | undefined): boolean {
  return line?.trim() === "";
}

function readParagraph(cursor: Cursor, body: string): ProseInput {
  cursor.at += 1;
  const text = [body.trim(), ...continuation(cursor)].join("\n");

  return { type: "paragraph", content: parseInline(text) };
}

/** The lines that carry on the text above them: not blank, and opening no block of their own. */
function continuation(cursor: Cursor): string[] {
  const lines: string[] = [];
  let line = lineAt(cursor);

  while (
    line !== undefined &&
    !isBlank(line) &&
    !startsBlock(line.trimStart())
  ) {
    lines.push(line.trim());
    cursor.at += 1;
    line = lineAt(cursor);
  }

  return lines;
}

function readCode(cursor: Cursor, body: string): ProseInput | null {
  const fence = fenceOpening(body);

  if (!fence) {
    return null;
  }

  cursor.at += 1;
  const code = linesUntil(cursor, (line) => closesFence(line, fence.marker));
  cursor.at += 1;

  return {
    type: "codeBlock",
    language: fence.tag || DEFAULT_CODE_LANGUAGE,
    content: inlineFromText(code.join("\n")),
  };
}

function linesUntil(cursor: Cursor, ends: (line: string) => boolean): string[] {
  const lines: string[] = [];
  let line = lineAt(cursor);

  while (line !== undefined && !ends(line)) {
    lines.push(line);
    cursor.at += 1;
    line = lineAt(cursor);
  }

  return lines;
}

function readHeading(cursor: Cursor, body: string): ProseInput | null {
  const text = headingText(body);

  if (text === null) {
    return null;
  }

  cursor.at += 1;

  return {
    type: "heading",
    level: AGENT_HEADING_LEVEL,
    content: parseInline(text),
  };
}

function readQuote(cursor: Cursor, body: string): ProseInput | null {
  if (!isQuote(body)) {
    return null;
  }

  const lines = linesUntil(cursor, (line) => !isQuote(line.trimStart()));
  const text = lines.map((line) => quoteText(line.trimStart())).join("\n");

  return { type: "quote", content: parseInline(text) };
}

function readTable(cursor: Cursor, body: string): ProseInput | null {
  if (!isTableRow(body) || !isTableSeparator(lineAt(cursor, 1) ?? "")) {
    return null;
  }

  const header = cellsOf(body);
  cursor.at += 2;
  const rows = linesUntil(cursor, (line) => !isTableRow(line.trimStart()));

  return {
    type: "table",
    rows: [header, ...rows.map(cellsOf)].map((cells) =>
      header.map((headerCell, index) => cells[index] ?? []),
    ),
  };
}

/** A row's cells, split on the pipes that are not escaped. */
function cellsOf(row: string): InlineContent[] {
  const trimmed = row.trim();
  const cells = splitCells(trimmed);
  const inner = cells.slice(
    1,
    trimmed.endsWith("|") && cells.at(-1) === "" ? -1 : undefined,
  );

  return inner.map((cell) => parseInline(cell.trim()));
}

function splitCells(row: string): string[] {
  const cells: string[] = [];
  let cell = "";

  for (let at = 0; at < row.length; at += 1) {
    const char = row.charAt(at);
    const next = row.charAt(at + 1);
    const escaped = char === "\\" && next !== "";

    if (char === "|") {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += escaped ? cellEscape(next) : char;
    at += escaped ? 1 : 0;
  }

  return [...cells, cell];
}

/** An escaped pipe is the table's own escape and reads as a pipe; any other escape is the text's. */
function cellEscape(char: string): string {
  return char === "|" ? char : `\\${char}`;
}

function readListItem(cursor: Cursor, body: string): ProseInput | null {
  const listed = listLine(body);

  if (!listed) {
    return null;
  }

  const indent = indentOf(lineAt(cursor) ?? "");
  cursor.at += 1;
  const text = [listed.text.trim(), ...continuation(cursor)].join("\n");
  const children = readProse(childLines(cursor, indent));

  return listItem(listed, parseInline(text), children);
}

function listItem(
  listed: ListLine,
  content: InlineContent,
  children: ProseInput[],
): ProseInput {
  const { type, checked } = listed;

  return type === "checkListItem"
    ? { type, checked, content, children }
    : { type, content, children };
}

/** The lines nested under an item, blank lines between them included, moved left to where the item's own blocks start. */
function childLines(cursor: Cursor, indent: number): string[] {
  const nested = (line: string) => indentOf(line) >= indent + CHILD_INDENT;
  const lines: string[] = [];
  let line = lineAt(cursor);

  while (line !== undefined && (nested(line) || isBlank(line))) {
    if (isBlank(line) && !nested(nextWritten(cursor))) {
      break;
    }

    lines.push(line);
    cursor.at += 1;
    line = lineAt(cursor);
  }

  return dedent(lines);
}

function nextWritten(cursor: Cursor): string {
  let offset = 0;

  while (isBlank(lineAt(cursor, offset))) {
    offset += 1;
  }

  return lineAt(cursor, offset) ?? "";
}

function dedent(lines: readonly string[]): string[] {
  const written = lines.filter((line) => !isBlank(line));
  const shift = Math.min(...written.map(indentOf));

  return lines.map((line) => (isBlank(line) ? "" : line.slice(shift)));
}
