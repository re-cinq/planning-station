import { closesFence, fenceTag, groupParagraphs, isReadOnly, parseHeading, unescapeLine, } from "./markdown-syntax.js";
/** Reads plan.md in one pass; what precedes the first section, the plan's title included, is not read. */
export function readMarkdown(markdown) {
    const reader = new MarkdownReader();
    markdown.split(/\r?\n/).forEach((line) => reader.read(line));
    return reader.finish();
}
class MarkdownReader {
    sections = [];
    fence = null;
    read(line) {
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
    finish() {
        if (this.fence) {
            this.keepFence(this.fence);
        }
        return this.sections.map(({ lines, ...section }) => ({
            ...section,
            paragraphs: groupParagraphs(lines),
        }));
    }
    inFence(fence, line) {
        if (closesFence(line)) {
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
    inSection(line) {
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
//# sourceMappingURL=read-markdown.js.map