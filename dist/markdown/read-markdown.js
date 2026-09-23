import { closesFence, fenceOpening, isPlanFence, isReadOnly, parseHeading, } from "./markdown-syntax.js";
import { readProse } from "./read-prose.js";
/** Reads plan.md in one pass; what precedes the first section, the plan's title included, is not read. */
export function readMarkdown(markdown) {
    const reader = new MarkdownReader();
    markdown.split(/\r?\n/).forEach((line) => reader.read(line));
    return reader.finish();
}
class MarkdownReader {
    sections = [];
    fence = null;
    codeMarker = null;
    read(line) {
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
    finish() {
        if (this.fence) {
            this.keepFence(this.fence);
        }
        return this.sections.map(({ lines, ...section }) => ({
            ...section,
            prose: readProse(lines),
        }));
    }
    inFence(fence, line) {
        if (closesFence(line, fence.marker)) {
            this.keepFence({ ...fence, closed: true });
            return;
        }
        fence.lines.push(line);
    }
    keepFence({ tag, lines, closed }) {
        const fence = { tag, body: lines.join("\n"), closed };
        this.sections.at(-1)?.fences.push(fence);
        this.fence = null;
    }
    outside(line) {
        const heading = parseHeading(line);
        if (heading) {
            this.sections.push({ ...heading, lines: [], fences: [] });
            return;
        }
        this.inSection(line);
    }
    /** A code block is prose, kept line for line, so nothing inside it reads as a section or a fence. */
    inCode(marker, line) {
        this.sections.at(-1)?.lines.push(line);
        this.codeMarker = closesFence(line, marker) ? null : marker;
    }
    inSection(line) {
        this.open(fenceOpening(line));
        // A plan fence or the conversation ends the prose before it, as a blank line would.
        const breaks = this.fence !== null || isReadOnly(line);
        this.sections.at(-1)?.lines.push(breaks ? "" : line);
    }
    open(opening) {
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
//# sourceMappingURL=read-markdown.js.map