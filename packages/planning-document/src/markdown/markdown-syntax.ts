/** How a plan is spelled in plan.md: its sections, fenced entities, read-only conversation and the Markdown its prose is written in. */

const SECTION_PREFIX = "## ";
const SLOT_MARKED = /^## (.*?)\s*<!-- slot:(\S+) -->\s*$/;
const FENCE = "```";
const FENCE_OPENING = /^(`{3,})([^`]*)$/;
const FENCE_CLOSING = /^`{3,}\s*$/;
const QUOTE = ">";
const CONVERSATION = /^> \*\*(Question|Answer|Comment)\*\*/;
const MOCKUP_NOTE = "_(mockup: ";
const HEADING = /^#{1,6}(?:\s+|$)/;
const BULLET = /^[-*+](?:\s+|$)/;
const NUMBERED = /^(\d{1,9})([.)])(?:\s+|$)/;
const CHECKBOX = /^\[([ xX])\](?:\s+|$)/;
const TABLE_ROW = "|";
const TABLE_SEPARATOR = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const ESCAPED_START = /^[>|]/;
const CHECKED = "x";

/** The fences that hold a plan entity; any other fence is a code block. */
export const PLAN_FENCES = ["kpi", "prototype", "question"] as const;

export type PlanFence = (typeof PLAN_FENCES)[number];

export interface HeadingLine {
  title: string;
  slot: string | null;
}

export interface FenceOpening {
  marker: string;
  tag: string;
}

export type ListKind = "bulletListItem" | "numberedListItem" | "checkListItem";

export interface ListLine {
  type: ListKind;
  checked: boolean;
  text: string;
}

export function planHeading(title: string): string {
  return `# ${title}`;
}

export function sectionHeading(title: string, slot: string): string {
  return `${SECTION_PREFIX}${title} <!-- slot:${slot} -->`;
}

export function parseHeading(line: string): HeadingLine | null {
  if (!line.startsWith(SECTION_PREFIX)) {
    return null;
  }

  const marked = SLOT_MARKED.exec(line);

  return marked
    ? { title: (marked[1] ?? "").trim(), slot: marked[2] ?? null }
    : { title: line.slice(SECTION_PREFIX.length).trim(), slot: null };
}

export function fenced(tag: string, value: object): string[] {
  return [
    `${FENCE}${tag}`,
    ...JSON.stringify(value, null, 2).split("\n"),
    FENCE,
  ];
}

/** The backticks a fence opens with and its tag, or null when the line opens none. */
export function fenceOpening(line: string): FenceOpening | null {
  const opening = FENCE_OPENING.exec(line);

  return opening
    ? { marker: opening[1] ?? FENCE, tag: (opening[2] ?? "").trim() }
    : null;
}

/** A fence closes on a line of at least as many backticks as opened it. */
export function closesFence(line: string, marker: string): boolean {
  const trimmed = line.trim();

  return FENCE_CLOSING.test(trimmed) && trimmed.length >= marker.length;
}

export function isPlanFence(tag: string): tag is PlanFence {
  return (PLAN_FENCES as readonly string[]).includes(tag);
}

export function quoted(label: string, text: string): string {
  return `${QUOTE} **${label}**${text}`;
}

/** A quote reading like the conversation takes a second space, which Markdown ignores, so it is not dropped as conversation. */
export function quoteLine(text: string): string {
  const line = text === "" ? QUOTE : `${QUOTE} ${text}`;

  return CONVERSATION.test(line) ? `${QUOTE}  ${text}` : line;
}

export function mockupNote(format: string): string {
  return `${MOCKUP_NOTE}${format}, not editable here)_`;
}

/** The conversation and the mockup note are shown to the agent, never read back. */
export function isReadOnly(line: string): boolean {
  return CONVERSATION.test(line) || line.startsWith(MOCKUP_NOTE);
}

export function isQuote(body: string): boolean {
  return body.startsWith(QUOTE);
}

export function quoteText(body: string): string {
  return body.slice(QUOTE.length).trim();
}

/** A `#` to `######` heading's text; inside a section every heading is a subheading. */
export function headingText(body: string): string | null {
  const heading = HEADING.exec(body);

  return heading ? body.slice(heading[0].length).trim() : null;
}

export function listLine(body: string): ListLine | null {
  const numbered = NUMBERED.exec(body);

  if (numbered) {
    const text = body.slice(numbered[0].length);

    return { type: "numberedListItem", checked: false, text };
  }

  const bullet = BULLET.exec(body);

  return bullet ? bulletLine(body.slice(bullet[0].length)) : null;
}

function bulletLine(text: string): ListLine {
  const checkbox = CHECKBOX.exec(text);

  if (!checkbox) {
    return { type: "bulletListItem", checked: false, text };
  }

  const checked = checkbox[1]?.toLowerCase() === CHECKED;

  return {
    type: "checkListItem",
    checked,
    text: text.slice(checkbox[0].length),
  };
}

export function listMarker(
  listed: Omit<ListLine, "text">,
  number: number,
): string {
  if (listed.type === "numberedListItem") {
    return `${number}.`;
  }

  const box = listed.checked ? CHECKED : " ";

  return listed.type === "checkListItem" ? `- [${box}]` : "-";
}

export function isTableRow(body: string): boolean {
  return body.startsWith(TABLE_ROW);
}

export function isTableSeparator(line: string): boolean {
  return TABLE_SEPARATOR.test(line.trim());
}

/** Any line that opens a block other than a paragraph ends the paragraph before it. */
export function startsBlock(body: string): boolean {
  return (
    HEADING.test(body) ||
    listLine(body) !== null ||
    isQuote(body) ||
    isTableRow(body) ||
    fenceOpening(body) !== null
  );
}

/** A line of text that would read as syntax is written behind a backslash; a numbered one escapes its dot. */
export function escapeBlockStart(line: string): string {
  if (NUMBERED.test(line)) {
    return line.replace(NUMBERED, (start, digits: string, dot: string) =>
      start.replace(`${digits}${dot}`, `${digits}\\${dot}`),
    );
  }

  return HEADING.test(line) || BULLET.test(line) || ESCAPED_START.test(line)
    ? `\\${line}`
    : line;
}

export function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}
