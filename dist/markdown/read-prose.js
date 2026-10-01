import { inlineFromText } from "../blocks/inline-text.js";
import { AGENT_HEADING_LEVEL, DEFAULT_CODE_LANGUAGE, } from "../ops/prose-input.js";
import { parseInline } from "./inline-parse.js";
import { closesFence, fenceOpening, headingText, indentOf, isQuote, isTableRow, isTableSeparator, listLine, quoteText, startsBlock, } from "./markdown-syntax.js";
/** A nested item sits at least this far right of its parent's marker. */
const CHILD_INDENT = 2;
const READERS = [
    readCode,
    readHeading,
    readQuote,
    readTable,
    readListItem,
];
/** A section's prose lines as blocks: paragraphs, subheadings, nested lists, quotes, code and tables. */
export function readProse(lines) {
    const cursor = { lines, at: 0 };
    const blocks = [];
    while (cursor.at < lines.length) {
        const block = readBlock(cursor);
        if (block) {
            blocks.push(block);
        }
    }
    return blocks;
}
function readBlock(cursor) {
    const line = lineAt(cursor) ?? "";
    if (isBlank(line)) {
        cursor.at += 1;
        return null;
    }
    const body = line.trimStart();
    for (const reader of READERS) {
        const block = reader(cursor, body);
        if (block) {
            return block;
        }
    }
    return readParagraph(cursor, body);
}
function lineAt(cursor, offset = 0) {
    return cursor.lines[cursor.at + offset];
}
function isBlank(line) {
    return line?.trim() === "";
}
function readParagraph(cursor, body) {
    cursor.at += 1;
    const text = [body.trim(), ...continuation(cursor)].join("\n");
    return { type: "paragraph", content: parseInline(text) };
}
/** The lines that carry on the text above them: not blank, and opening no block of their own. */
function continuation(cursor) {
    const lines = [];
    let line = lineAt(cursor);
    while (line !== undefined &&
        !isBlank(line) &&
        !startsBlock(line.trimStart())) {
        lines.push(line.trim());
        cursor.at += 1;
        line = lineAt(cursor);
    }
    return lines;
}
function readCode(cursor, body) {
    const fence = fenceOpening(body);
    if (!fence) {
        return null;
    }
    cursor.at += 1;
    const code = linesUntil(cursor, (line) => closesFence(line, fence.marker));
    cursor.at += 1;
    return {
        type: "codeBlock",
        language: fence.tag || DEFAULT_CODE_LANGUAGE,
        content: inlineFromText(code.join("\n")),
    };
}
function linesUntil(cursor, ends) {
    const lines = [];
    let line = lineAt(cursor);
    while (line !== undefined && !ends(line)) {
        lines.push(line);
        cursor.at += 1;
        line = lineAt(cursor);
    }
    return lines;
}
function readHeading(cursor, body) {
    const text = headingText(body);
    if (text === null) {
        return null;
    }
    cursor.at += 1;
    return {
        type: "heading",
        level: AGENT_HEADING_LEVEL,
        content: parseInline(text),
    };
}
function readQuote(cursor, body) {
    if (!isQuote(body)) {
        return null;
    }
    const lines = linesUntil(cursor, (line) => !isQuote(line.trimStart()));
    const text = lines.map((line) => quoteText(line.trimStart())).join("\n");
    return { type: "quote", content: parseInline(text) };
}
function readTable(cursor, body) {
    if (!isTableRow(body) || !isTableSeparator(lineAt(cursor, 1) ?? "")) {
        return null;
    }
    const header = cellsOf(body);
    cursor.at += 2;
    const rows = linesUntil(cursor, (line) => !isTableRow(line.trimStart()));
    return {
        type: "table",
        rows: [header, ...rows.map(cellsOf)].map((cells) => header.map((headerCell, index) => cells[index] ?? [])),
    };
}
/** A row's cells, split on the pipes that are not escaped. */
function cellsOf(row) {
    const trimmed = row.trim();
    const cells = splitCells(trimmed);
    const inner = cells.slice(1, trimmed.endsWith("|") && cells.at(-1) === "" ? -1 : undefined);
    return inner.map((cell) => parseInline(cell.trim()));
}
function splitCells(row) {
    const cells = [];
    let cell = "";
    for (let at = 0; at < row.length; at += 1) {
        const char = row.charAt(at);
        const next = row.charAt(at + 1);
        const escaped = char === "\\" && next !== "";
        if (char === "|") {
            cells.push(cell);
            cell = "";
            continue;
        }
        cell += escaped ? cellEscape(next) : char;
        at += escaped ? 1 : 0;
    }
    return [...cells, cell];
}
/** An escaped pipe is the table's own escape and reads as a pipe; any other escape is the text's. */
function cellEscape(char) {
    return char === "|" ? char : `\\${char}`;
}
function readListItem(cursor, body) {
    const listed = listLine(body);
    if (!listed) {
        return null;
    }
    const indent = indentOf(lineAt(cursor) ?? "");
    cursor.at += 1;
    const text = [listed.text.trim(), ...continuation(cursor)].join("\n");
    const children = readProse(childLines(cursor, indent));
    return listItem(listed, parseInline(text), children);
}
function listItem(listed, content, children) {
    const { type, checked } = listed;
    return type === "checkListItem"
        ? { type, checked, content, children }
        : { type, content, children };
}
/** The lines nested under an item, blank lines between them included, moved left to where the item's own blocks start. */
function childLines(cursor, indent) {
    const nested = (line) => indentOf(line) >= indent + CHILD_INDENT;
    const lines = [];
    let line = lineAt(cursor);
    while (line !== undefined && (nested(line) || isBlank(line))) {
        if (isBlank(line) && !nested(nextWritten(cursor))) {
            break;
        }
        lines.push(line);
        cursor.at += 1;
        line = lineAt(cursor);
    }
    return dedent(lines);
}
function nextWritten(cursor) {
    let offset = 0;
    while (isBlank(lineAt(cursor, offset))) {
        offset += 1;
    }
    return lineAt(cursor, offset) ?? "";
}
function dedent(lines) {
    const written = lines.filter((line) => !isBlank(line));
    const shift = Math.min(...written.map(indentOf));
    return lines.map((line) => (isBlank(line) ? "" : line.slice(shift)));
}
//# sourceMappingURL=read-prose.js.map