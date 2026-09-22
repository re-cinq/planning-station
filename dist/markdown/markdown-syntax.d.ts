/** How a plan is spelled in plan.md: what marks a section, a fenced entity and the read-only conversation. */
export interface HeadingLine {
    title: string;
    slot: string | null;
}
export declare function planHeading(title: string): string;
export declare function sectionHeading(title: string, slot: string): string;
export declare function parseHeading(line: string): HeadingLine | null;
export declare function fenced(tag: string, value: object): string[];
/** The tag a fence opens with, or null when the line opens none. */
export declare function fenceTag(line: string): string | null;
export declare function closesFence(line: string): boolean;
export declare function quoted(label: string, text: string): string;
export declare function mockupNote(format: string): string;
/** The conversation and the mockup note are shown to the agent, never read back. */
export declare function isReadOnly(line: string): boolean;
export declare function escapeLine(line: string): string;
export declare function unescapeLine(line: string): string;
/** Lines to paragraphs: a blank line ends one, and runs of blank lines count once. */
export declare function groupParagraphs(lines: readonly string[]): string[];
//# sourceMappingURL=markdown-syntax.d.ts.map