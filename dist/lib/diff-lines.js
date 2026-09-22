export const LINE_CHANGES = ["kept", "added", "removed"];
/** The longest common run of lines is kept; everything else is added or removed. */
export function diffLines(before, after) {
    const diffing = { before, after, table: lcsTable(before, after) };
    return changesFrom(diffing, { row: 0, col: 0 });
}
function changesFrom(diffing, at) {
    const { before, after } = diffing;
    if (at.row >= before.length) {
        return after.slice(at.col).map((text) => change("added", text));
    }
    if (at.col >= after.length) {
        return before.slice(at.row).map((text) => change("removed", text));
    }
    return stepFrom(diffing, at);
}
function stepFrom(diffing, at) {
    const line = diffing.before[at.row] ?? "";
    const other = diffing.after[at.col] ?? "";
    if (line === other) {
        const next = { row: at.row + 1, col: at.col + 1 };
        return [change("kept", line), ...changesFrom(diffing, next)];
    }
    if (keepsMore(diffing, at)) {
        const next = { row: at.row + 1, col: at.col };
        return [change("removed", line), ...changesFrom(diffing, next)];
    }
    return [
        change("added", other),
        ...changesFrom(diffing, { row: at.row, col: at.col + 1 }),
    ];
}
function keepsMore(diffing, at) {
    return cell(diffing, at.row + 1, at.col) >= cell(diffing, at.row, at.col + 1);
}
function cell(diffing, row, col) {
    const cells = diffing.table[row] ?? [];
    return cells[col] ?? 0;
}
function change(kind, text) {
    return { kind, text };
}
function lcsTable(before, after) {
    const empty = new Array(after.length + 1).fill(0);
    return before.reduceRight((rows, line) => [rowFor(line, after, rows[0] ?? empty), ...rows], [empty]);
}
function rowFor(line, after, next) {
    return after.reduceRight((row, other, col) => [
        line === other
            ? (next[col + 1] ?? 0) + 1
            : Math.max(next[col] ?? 0, row[0] ?? 0),
        ...row,
    ], [0]);
}
//# sourceMappingURL=diff-lines.js.map