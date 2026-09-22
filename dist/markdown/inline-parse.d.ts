import type { InlineContent } from "../blocks/inline-text.js";
type InlineNode = InlineContent[number];
export declare const WORD: RegExp;
/** Inline Markdown to text and link nodes: bold, italic, strike, code and links; anything unbalanced stays literal. */
export declare function parseInline(markdown: string): InlineContent;
/** Adjacent text nodes styled alike become one, and empty ones go. */
export declare function mergeTexts(nodes: readonly InlineNode[]): InlineContent;
export {};
//# sourceMappingURL=inline-parse.d.ts.map