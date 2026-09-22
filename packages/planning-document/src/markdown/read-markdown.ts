import type { ProseInput } from "../ops/prose-input.js";
import {
  closesFence,
  fenceOpening,
  isPlanFence,
  isReadOnly,
  parseHeading,
  type FenceOpening,
  type PlanFence,
} from "./markdown-syntax.js";
import { readProse } from "./read-prose.js";

export interface Fence {
  tag: PlanFence;
  body: string;
  closed: boolean;
}

/** One `## ` section of plan.md: its heading, its prose and its fenced entities. */
export interface MarkdownSection {
  title: string;
  slot: string | null;
  prose: ProseInput[];
  fences: Fence[];
}

interface OpenSection {
  title: string;
  slot: string | null;
  lines: string[];
  fences: Fence[];
}

interface OpenFence {
  tag: PlanFence;
  marker: string;
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
  private codeMarker: string | null = null;

  read(line: string): void {
    if (this.fence) {
      this.inFence(this.fence, line);

      return;
    }

    if (this.codeMarker === null) {
      this.outside(line);

      return;
    }

    this.inCode(this.codeMarker, line);
  }

  finish(): MarkdownSection[] {
    if (this.fence) {
      this.keepFence(this.fence);
    }

    return this.sections.map(({ lines, ...section }) => ({
      ...section,
      prose: readProse(lines),
    }));
  }

  private inFence(fence: OpenFence, line: string): void {
    if (closesFence(line, fence.marker)) {
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

  private outside(line: string): void {
    const heading = parseHeading(line);

    if (heading) {
      this.sections.push({ ...heading, lines: [], fences: [] });

      return;
    }

    this.inSection(line);
  }

  /** A code block is prose, kept line for line, so nothing inside it reads as a section or a fence. */
  private inCode(marker: string, line: string): void {
    this.sections.at(-1)?.lines.push(line);
    this.codeMarker = closesFence(line, marker) ? null : marker;
  }

  private inSection(line: string): void {
    this.open(fenceOpening(line));

    // A plan fence or the conversation ends the prose before it, as a blank line would.
    const breaks = this.fence !== null || isReadOnly(line);
    this.sections.at(-1)?.lines.push(breaks ? "" : line);
  }

  private open(opening: FenceOpening | null): void {
    if (opening === null) {
      return;
    }

    if (isPlanFence(opening.tag)) {
      this.fence = { ...opening, tag: opening.tag, lines: [], closed: false };

      return;
    }

    this.codeMarker = opening.marker;
  }
}
