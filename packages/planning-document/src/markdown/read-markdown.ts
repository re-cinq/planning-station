import {
  closesFence,
  fenceTag,
  groupParagraphs,
  isReadOnly,
  parseHeading,
  unescapeLine,
} from "./markdown-syntax.js";

export interface Fence {
  tag: string;
  body: string;
  closed: boolean;
}

/** One `## ` section of plan.md: its heading, its prose and its fenced entities. */
export interface MarkdownSection {
  title: string;
  slot: string | null;
  paragraphs: string[];
  fences: Fence[];
}

interface OpenSection {
  title: string;
  slot: string | null;
  lines: string[];
  fences: Fence[];
}

interface OpenFence {
  tag: string;
  lines: string[];
  closed: boolean;
}

/** Reads plan.md in one pass; what precedes the first section, the plan's title included, is not read. */
export function readMarkdown(markdown: string): MarkdownSection[] {
  const reader = new MarkdownReader();
  markdown.split(/\r?\n/).forEach((line) => reader.read(line));

  return reader.finish();
}

class MarkdownReader {
  private readonly sections: OpenSection[] = [];
  private fence: OpenFence | null = null;

  read(line: string): void {
    if (this.fence) {
      this.inFence(this.fence, line);

      return;
    }

    const heading = parseHeading(line);

    if (heading) {
      this.sections.push({ ...heading, lines: [], fences: [] });

      return;
    }

    this.inSection(line);
  }

  finish(): MarkdownSection[] {
    if (this.fence) {
      this.keepFence(this.fence);
    }

    return this.sections.map(({ lines, ...section }) => ({
      ...section,
      paragraphs: groupParagraphs(lines),
    }));
  }

  private inFence(fence: OpenFence, line: string): void {
    if (closesFence(line)) {
      this.keepFence({ ...fence, closed: true });

      return;
    }

    fence.lines.push(line);
  }

  private keepFence({ tag, lines, closed }: OpenFence): void {
    const fence = { tag, body: lines.join("\n"), closed };
    this.sections.at(-1)?.fences.push(fence);
    this.fence = null;
  }

  private inSection(line: string): void {
    const section = this.sections.at(-1);
    const tag = fenceTag(line);

    if (tag !== null) {
      this.fence = { tag, lines: [], closed: false };
    }

    // A fence or a quote ends the paragraph before it, as a blank line would.
    const breaks = tag !== null || isReadOnly(line);
    section?.lines.push(breaks ? "" : unescapeLine(line));
  }
}
