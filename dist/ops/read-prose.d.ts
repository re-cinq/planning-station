import { type ProseInput } from "./prose-input.js";
/** One run of Markdown text as blocks, whatever line endings it was typed with. */
export declare function proseFromMarkdown(text: string): ProseInput[];
/** A section's prose lines as blocks: paragraphs, subheadings, nested lists, quotes, code and tables. */
export declare function readProse(lines: readonly string[]): ProseInput[];
//# sourceMappingURL=read-prose.d.ts.map