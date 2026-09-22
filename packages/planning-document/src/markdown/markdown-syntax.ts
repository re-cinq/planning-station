/** How a plan is spelled in plan.md: what marks a section, a fenced entity and the read-only conversation. */

const SECTION_PREFIX = "## ";
const SLOT_MARKED = /^## (.*?)\s*<!-- slot:(\S+) -->\s*$/;
const FENCE = "```";
const QUOTE = ">";
const MOCKUP_NOTE = "_(mockup: ";
const ESCAPE = "\\";

/** A prose line opening like this would read as syntax, so it is written behind a backslash. */
const SYNTAX_STARTS: readonly string[] = ["#", QUOTE, "`", ESCAPE, "_("];

export interface HeadingLine {
  title: string;
  slot: string | null;
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

/** The tag a fence opens with, or null when the line opens none. */
export function fenceTag(line: string): string | null {
  return line.startsWith(FENCE) ? line.slice(FENCE.length).trim() : null;
}

export function closesFence(line: string): boolean {
  return line.trim() === FENCE;
}

export function quoted(label: string, text: string): string {
  return `${QUOTE} **${label}**${text}`;
}

export function mockupNote(format: string): string {
  return `${MOCKUP_NOTE}${format}, not editable here)_`;
}

/** The conversation and the mockup note are shown to the agent, never read back. */
export function isReadOnly(line: string): boolean {
  return line.startsWith(QUOTE) || line.startsWith(MOCKUP_NOTE);
}

export function escapeLine(line: string): string {
  return SYNTAX_STARTS.some((start) => line.startsWith(start))
    ? `${ESCAPE}${line}`
    : line;
}

export function unescapeLine(line: string): string {
  return line.startsWith(ESCAPE) ? line.slice(ESCAPE.length) : line;
}

/** Lines to paragraphs: a blank line ends one, and runs of blank lines count once. */
export function groupParagraphs(lines: readonly string[]): string[] {
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() !== "") {
      current.push(line);
      continue;
    }

    if (current.length > 0) {
      paragraphs.push(current.join("\n"));
      current = [];
    }
  }

  return current.length > 0 ? [...paragraphs, current.join("\n")] : paragraphs;
}
