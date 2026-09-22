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
export const PLAN_FENCES = ["kpi", "prototype", "question"];
export function planHeading(title) {
    return `# ${title}`;
}
export function sectionHeading(title, slot) {
    return `${SECTION_PREFIX}${title} <!-- slot:${slot} -->`;
}
export function parseHeading(line) {
    if (!line.startsWith(SECTION_PREFIX)) {
        return null;
    }
    const marked = SLOT_MARKED.exec(line);
    return marked
        ? { title: (marked[1] ?? "").trim(), slot: marked[2] ?? null }
        : { title: line.slice(SECTION_PREFIX.length).trim(), slot: null };
}
export function fenced(tag, value) {
    return [
        `${FENCE}${tag}`,
        ...JSON.stringify(value, null, 2).split("\n"),
        FENCE,
    ];
}
/** The backticks a fence opens with and its tag, or null when the line opens none. */
export function fenceOpening(line) {
    const opening = FENCE_OPENING.exec(line);
    return opening
        ? { marker: opening[1] ?? FENCE, tag: (opening[2] ?? "").trim() }
        : null;
}
/** A fence closes on a line of at least as many backticks as opened it. */
export function closesFence(line, marker) {
    const trimmed = line.trim();
    return FENCE_CLOSING.test(trimmed) && trimmed.length >= marker.length;
}
export function isPlanFence(tag) {
    return PLAN_FENCES.includes(tag);
}
export function quoted(label, text) {
    return `${QUOTE} **${label}**${text}`;
}
/** A quote reading like the conversation takes a second space, which Markdown ignores, so it is not dropped as conversation. */
export function quoteLine(text) {
    const line = text === "" ? QUOTE : `${QUOTE} ${text}`;
    return CONVERSATION.test(line) ? `${QUOTE}  ${text}` : line;
}
export function mockupNote(format) {
    return `${MOCKUP_NOTE}${format}, not editable here)_`;
}
/** The conversation and the mockup note are shown to the agent, never read back. */
export function isReadOnly(line) {
    return CONVERSATION.test(line) || line.startsWith(MOCKUP_NOTE);
}
export function isQuote(body) {
    return body.startsWith(QUOTE);
}
export function quoteText(body) {
    return body.slice(QUOTE.length).trim();
}
/** A `#` to `######` heading's text; inside a section every heading is a subheading. */
export function headingText(body) {
    const heading = HEADING.exec(body);
    return heading ? body.slice(heading[0].length).trim() : null;
}
export function listLine(body) {
    const numbered = NUMBERED.exec(body);
    if (numbered) {
        const text = body.slice(numbered[0].length);
        return { type: "numberedListItem", checked: false, text };
    }
    const bullet = BULLET.exec(body);
    return bullet ? bulletLine(body.slice(bullet[0].length)) : null;
}
function bulletLine(text) {
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
export function listMarker(listed, number) {
    if (listed.type === "numberedListItem") {
        return `${number}.`;
    }
    const box = listed.checked ? CHECKED : " ";
    return listed.type === "checkListItem" ? `- [${box}]` : "-";
}
export function isTableRow(body) {
    return body.startsWith(TABLE_ROW);
}
export function isTableSeparator(line) {
    return TABLE_SEPARATOR.test(line.trim());
}
/** Any line that opens a block other than a paragraph ends the paragraph before it. */
export function startsBlock(body) {
    return (HEADING.test(body) ||
        listLine(body) !== null ||
        isQuote(body) ||
        isTableRow(body) ||
        fenceOpening(body) !== null);
}
/** A line of text that would read as syntax is written behind a backslash; a numbered one escapes its dot. */
export function escapeBlockStart(line) {
    if (NUMBERED.test(line)) {
        return line.replace(NUMBERED, (start, digits, dot) => start.replace(`${digits}${dot}`, `${digits}\\${dot}`));
    }
    return HEADING.test(line) || BULLET.test(line) || ESCAPED_START.test(line)
        ? `\\${line}`
        : line;
}
export function indentOf(line) {
    return line.length - line.trimStart().length;
}
//# sourceMappingURL=markdown-syntax.js.map