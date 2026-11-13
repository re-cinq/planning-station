const SPECIAL = /[\\`[*_~]/g;
const PUNCTUATION = /[!-/:-@[-`{-~]/;
const ESCAPED = /\\([!-/:-@[-`{-~])/g;
const SPACE = /\s/;
const STRIKE_RUN = 2;
const STRONG_RUN = 2;
const RULE_OF_THREE = 3;
export const WORD = /[\p{L}\p{N}]/u;
const READERS = {
    "\\": readEscape,
    "`": readCode,
    "[": readLink,
    "*": readRun,
    _: readRun,
    "~": readRun,
};
/** Inline Markdown to text and link nodes: bold, italic, strike, code and links; anything unbalanced stays literal. */
export function parseInline(markdown) {
    return mergeTexts(resolveEmphasis(scan(markdown)).flatMap(nodesOf));
}
/** Adjacent text nodes styled alike become one, and empty ones go. */
export function mergeTexts(nodes) {
    const merged = [];
    nodes.filter(isWritten).forEach((node) => appendNode(merged, node));
    return merged;
}
function isWritten(node) {
    return node.type === "link" || node.text !== "";
}
function appendNode(merged, node) {
    const last = merged.at(-1);
    if (last?.type === "text" && node.type === "text" && sameStyles(last, node)) {
        merged[merged.length - 1] = { ...last, text: last.text + node.text };
        return;
    }
    merged.push(node);
}
function sameStyles(left, right) {
    const keys = Object.keys(left.styles);
    return (keys.length === Object.keys(right.styles).length &&
        keys.every((key) => left.styles[key] === right.styles[key]));
}
function scan(source) {
    const pieces = [];
    let at = 0;
    while (at < source.length) {
        const read = READERS[source.charAt(at)]?.(source, at) ?? readPlain(source, at);
        pieces.push(read.piece);
        at = read.end;
    }
    return pieces;
}
function readPlain(source, at) {
    SPECIAL.lastIndex = at + 1;
    const next = SPECIAL.exec(source);
    const end = next ? next.index : source.length;
    return { piece: text(source.slice(at, end)), end };
}
function text(value, styles = {}) {
    return { kind: "text", text: value, styles };
}
function readEscape(source, at) {
    const escaped = source.charAt(at + 1);
    return PUNCTUATION.test(escaped)
        ? { piece: text(escaped), end: at + 2 }
        : null;
}
function readCode(source, at) {
    const fenceEnd = runEnd(source, at);
    const fence = source.slice(at, fenceEnd);
    const close = closingCode(source, fenceEnd, fence.length);
    if (close < 0) {
        return { piece: text(fence), end: fenceEnd };
    }
    const body = unpadded(source.slice(fenceEnd, close));
    return { piece: text(body, { code: true }), end: close + fence.length };
}
function runEnd(source, at) {
    let end = at;
    while (source.charAt(end) === source.charAt(at)) {
        end += 1;
    }
    return end;
}
/** A code span closes on a run of exactly as many backticks as opened it. */
function closingCode(source, from, length) {
    let at = source.indexOf("`", from);
    while (at >= 0) {
        const end = runEnd(source, at);
        if (end - at === length) {
            return at;
        }
        at = source.indexOf("`", end);
    }
    return -1;
}
function unpadded(body) {
    const padded = body.startsWith(" ") && body.endsWith(" ");
    return padded && body.trim() !== "" ? body.slice(1, -1) : body;
}
function readLink(source, at) {
    const close = closingBracket(source, at);
    if (close < 0 || source.charAt(close + 1) !== "(") {
        return null;
    }
    const hrefEnd = closingParen(source, close + 2);
    if (hrefEnd < 0) {
        return null;
    }
    const content = parseInline(source.slice(at + 1, close)).flatMap(textsOf);
    const href = source.slice(close + 2, hrefEnd).replace(ESCAPED, "$1");
    return {
        piece: { kind: "link", href, content, styles: {} },
        end: hrefEnd + 1,
    };
}
function closingBracket(source, at) {
    let depth = 0;
    for (let index = at; index < source.length; index += 1) {
        const char = source.charAt(index);
        if (char === "\\") {
            index += 1;
            continue;
        }
        depth += bracketStep(char);
        if (depth === 0) {
            return index;
        }
    }
    return -1;
}
function bracketStep(char) {
    if (char === "[") {
        return 1;
    }
    return char === "]" ? -1 : 0;
}
function closingParen(source, from) {
    for (let index = from; index < source.length; index += 1) {
        const char = source.charAt(index);
        if (char === ")") {
            return index;
        }
        index += char === "\\" ? 1 : 0;
    }
    return -1;
}
/** A link holds styled text only, so a link written inside one keeps just its text. */
function textsOf(node) {
    return node.type === "text" ? [node] : node.content;
}
function readRun(source, at) {
    const end = runEnd(source, at);
    const char = source.charAt(at);
    const length = end - at;
    if (char === "~" && length !== STRIKE_RUN) {
        return { piece: text(source.slice(at, end)), end };
    }
    const flanks = flanking(char, source.charAt(at - 1), source.charAt(end));
    return {
        piece: { kind: "run", char, length, count: length, styles: {}, ...flanks },
        end,
    };
}
/** A run opens before a word and closes after one; `_` never does inside a word, so snake_case stays text. */
function flanking(char, before, after) {
    const intraword = char === "_";
    return {
        canOpen: isInk(after) && !(intraword && WORD.test(before)),
        canClose: isInk(before) && !(intraword && WORD.test(after)),
    };
}
function isInk(char) {
    return char !== "" && !SPACE.test(char);
}
function resolveEmphasis(pieces) {
    pieces.forEach((piece, closerAt) => {
        if (piece.kind === "run" && piece.canClose) {
            closeRun(pieces, piece, closerAt);
        }
    });
    return pieces;
}
function closeRun(pieces, closer, closerAt) {
    let openerAt = openerFor(pieces, closer, closerAt);
    while (openerAt >= 0 && closer.count > 0) {
        const opener = pieces[openerAt];
        const used = Math.min(STRONG_RUN, opener.count, closer.count);
        const inside = pieces.slice(openerAt + 1, closerAt);
        styleAll(inside, styleOf(closer.char, used));
        opener.count -= used;
        closer.count -= used;
        openerAt = openerFor(pieces, closer, closerAt);
    }
}
function openerFor(pieces, closer, closerAt) {
    return pieces.findLastIndex((piece, at) => at < closerAt &&
        piece.kind === "run" &&
        piece.char === closer.char &&
        piece.canOpen &&
        piece.count > 0 &&
        !breaksRuleOfThree(piece, closer));
}
/** CommonMark's rule of 3, which keeps `**a*b***` reading as bold a then bold italic b. */
function breaksRuleOfThree(opener, closer) {
    const either = opener.canClose || closer.canOpen;
    const sum = opener.length + closer.length;
    const bothThrees = opener.length % RULE_OF_THREE === 0 && closer.length % RULE_OF_THREE === 0;
    return either && sum % RULE_OF_THREE === 0 && !bothThrees;
}
function styleOf(char, used) {
    if (char === "~") {
        return "strike";
    }
    return used === STRONG_RUN ? "bold" : "italic";
}
/** What an opener and a closer enclose takes their style, and the runs inside can no longer pair outside it. */
function styleAll(inside, style) {
    inside.forEach((piece) => {
        piece.styles = { ...piece.styles, [style]: true };
        if (piece.kind === "run") {
            piece.canOpen = false;
            piece.canClose = false;
        }
    });
}
function nodesOf(piece) {
    if (piece.kind === "link") {
        const content = piece.content.map((node) => ({
            ...node,
            styles: { ...piece.styles, ...node.styles },
        }));
        return [
            {
                type: "link",
                href: piece.href,
                content: mergeTexts(content),
            },
        ];
    }
    const value = piece.kind === "run" ? piece.char.repeat(piece.count) : piece.text;
    return [{ type: "text", text: value, styles: piece.styles }];
}
//# sourceMappingURL=inline-parse.js.map