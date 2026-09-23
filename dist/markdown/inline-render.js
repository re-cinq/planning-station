import { mergeTexts, WORD } from "./inline-parse.js";
/** Outermost first, so a run styled bold and italic opens `***` and closes it the same way. */
const MARKS = ["strike", "bold", "italic"];
const MARKERS = {
    strike: "~~",
    bold: "**",
    italic: "*",
};
const WRITTEN_STYLES = [...MARKS, "code"];
const EDGE_SPACE = /^(\s*)(.*?)(\s*)$/s;
const ESCAPABLE = /[\\`*[_~]/g;
const BACKTICKS = /`+/g;
/** Inline nodes as canonical Markdown: `**`, `*`, `~~`, backticks and `[text](href)`, with literal syntax escaped so it reads back as the same nodes. */
export function renderInline(content) {
    return renderWith(content, escapeText);
}
function renderWith(content, escape) {
    const parts = [];
    let open = [];
    for (const node of canonicalInline(content)) {
        const step = transition(open, node.type === "text" ? marksOf(node.styles) : []);
        parts.push(step.markup, markupOf(node, escape));
        open = step.open;
    }
    parts.push(transition(open, []).markup);
    return parts.join("");
}
/** Only the styles Markdown can say, with no style opening on or closing after a space, so the markers stay readable. */
export function canonicalInline(content) {
    const written = mergeTexts(content.map(writtenNode));
    return mergeTexts(written.flatMap((node, at) => node.type === "text" && node.styles["code"] !== true
        ? spaced(node, stylesOf(written[at - 1]), stylesOf(written[at + 1]))
        : [node]));
}
function writtenNode(node) {
    if (node.type === "link") {
        return { ...node, content: canonicalInline(node.content) };
    }
    const styles = Object.fromEntries(WRITTEN_STYLES.filter((style) => node.styles[style] === true).map((style) => [style, true]));
    return { ...node, styles };
}
function stylesOf(node) {
    return node?.type === "text" ? node.styles : {};
}
function spaced(node, before, after) {
    const [, lead = "", core = "", trail = ""] = EDGE_SPACE.exec(node.text) ?? [];
    if (core === "") {
        return [{ ...node, styles: common(node.styles, before, after) }];
    }
    return [
        { ...node, text: lead, styles: common(node.styles, before) },
        { ...node, text: core },
        { ...node, text: trail, styles: common(node.styles, after) },
    ];
}
function common(styles, ...others) {
    return Object.fromEntries(Object.entries(styles).filter(([style]) => others.every((other) => other[style] === true)));
}
function marksOf(styles) {
    return MARKS.filter((mark) => styles[mark] === true);
}
/** Closes what the next node drops, innermost first, and opens what it adds. */
function transition(open, wanted) {
    const dropped = open.findIndex((mark) => !wanted.includes(mark));
    const kept = dropped < 0 ? [...open] : open.slice(0, dropped);
    const closing = open.slice(kept.length).reverse();
    const opening = MARKS.filter((mark) => wanted.includes(mark) && !kept.includes(mark));
    return {
        markup: [...closing, ...opening].map((mark) => MARKERS[mark]).join(""),
        open: [...kept, ...opening],
    };
}
function markupOf(node, escape) {
    if (node.type === "link") {
        return linkMarkup(node);
    }
    return node.styles["code"] === true ? codeSpan(node.text) : escape(node.text);
}
function linkMarkup(link) {
    const href = link.href.replace(/[\\()]/g, "\\$&");
    return `[${renderLinkText(link.content)}](${href})`;
}
/** A link's text also escapes `]`, which would end it early. */
function renderLinkText(content) {
    return renderWith(content, (value) => escapeText(value).replaceAll("]", "\\]"));
}
function codeSpan(code) {
    const longest = Math.max(0, ...(code.match(BACKTICKS) ?? []).map((run) => run.length));
    const fence = "`".repeat(longest + 1);
    const padding = needsPadding(code) ? " " : "";
    return `${fence}${padding}${code}${padding}${fence}`;
}
function needsPadding(code) {
    const spaced = code.startsWith(" ") && code.endsWith(" ") && code.trim() !== "";
    return spaced || code.startsWith("`") || code.endsWith("`");
}
function escapeText(value) {
    return value.replace(ESCAPABLE, (char, at) => needsEscape(char, value.charAt(at - 1), value.charAt(at + 1))
        ? `\\${char}`
        : char);
}
/** `_` inside a word and a lone `~` never read as syntax, so they stay bare. */
function needsEscape(char, before, after) {
    if (char === "_") {
        return !(WORD.test(before) && WORD.test(after));
    }
    if (char === "~") {
        return [before, after].some((side) => side === "" || side === "~");
    }
    return true;
}
//# sourceMappingURL=inline-render.js.map