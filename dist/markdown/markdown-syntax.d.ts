/** How a plan is spelled in plan.md: its sections, fenced entities, read-only conversation and the Markdown its prose is written in. */
/** The fences that hold a plan entity; any other fence is a code block. */
export declare const PLAN_FENCES: readonly ["kpi", "prototype", "question"];
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
export declare function planHeading(title: string): string;
export declare function sectionHeading(title: string, slot: string): string;
export declare function parseHeading(line: string): HeadingLine | null;
export declare function fenced(tag: string, value: object): string[];
/** The backticks a fence opens with and its tag, or null when the line opens none. */
export declare function fenceOpening(line: string): FenceOpening | null;
/** A fence closes on a line of at least as many backticks as opened it. */
export declare function closesFence(line: string, marker: string): boolean;
export declare function isPlanFence(tag: string): tag is PlanFence;
export declare function quoted(label: string, text: string): string;
/** A quote reading like the conversation takes a second space, which Markdown ignores, so it is not dropped as conversation. */
export declare function quoteLine(text: string): string;
export declare function mockupNote(format: string): string;
/** The conversation and the mockup note are shown to the agent, never read back. */
export declare function isReadOnly(line: string): boolean;
export declare function isQuote(body: string): boolean;
export declare function quoteText(body: string): string;
/** A `#` to `######` heading's text; inside a section every heading is a subheading. */
export declare function headingText(body: string): string | null;
export declare function listLine(body: string): ListLine | null;
export declare function listMarker(listed: Omit<ListLine, "text">, number: number): string;
export declare function isTableRow(body: string): boolean;
export declare function isTableSeparator(line: string): boolean;
/** Any line that opens a block other than a paragraph ends the paragraph before it. */
export declare function startsBlock(body: string): boolean;
/** A line of text that would read as syntax is written behind a backslash; a numbered one escapes its dot. */
export declare function escapeBlockStart(line: string): string;
export declare function indentOf(line: string): number;
//# sourceMappingURL=markdown-syntax.d.ts.map