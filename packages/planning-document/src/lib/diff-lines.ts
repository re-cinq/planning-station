export const LINE_CHANGES = ["kept", "added", "removed"] as const;

export type LineChangeKind = (typeof LINE_CHANGES)[number];

export interface LineChange {
  kind: LineChangeKind;
  text: string;
}

interface Diffing {
  before: readonly string[];
  after: readonly string[];
  table: number[][];
}

interface At {
  row: number;
  col: number;
}

/** The longest common run of lines is kept; everything else is added or removed. */
export function diffLines(
  before: readonly string[],
  after: readonly string[],
): LineChange[] {
  const diffing = { before, after, table: lcsTable(before, after) };

  return changesFrom(diffing, { row: 0, col: 0 });
}

function changesFrom(diffing: Diffing, at: At): LineChange[] {
  const { before, after } = diffing;

  if (at.row >= before.length) {
    return after.slice(at.col).map((text) => change("added", text));
  }

  if (at.col >= after.length) {
    return before.slice(at.row).map((text) => change("removed", text));
  }

  return stepFrom(diffing, at);
}

function stepFrom(diffing: Diffing, at: At): LineChange[] {
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

function keepsMore(diffing: Diffing, at: At): boolean {
  return cell(diffing, at.row + 1, at.col) >= cell(diffing, at.row, at.col + 1);
}

function cell(diffing: Diffing, row: number, col: number): number {
  const cells = diffing.table[row] ?? [];

  return cells[col] ?? 0;
}

function change(kind: LineChangeKind, text: string): LineChange {
  return { kind, text };
}

function lcsTable(
  before: readonly string[],
  after: readonly string[],
): number[][] {
  const empty = new Array<number>(after.length + 1).fill(0);

  return before.reduceRight<number[][]>(
    (rows, line) => [rowFor(line, after, rows[0] ?? empty), ...rows],
    [empty],
  );
}

function rowFor(
  line: string,
  after: readonly string[],
  next: readonly number[],
): number[] {
  return after.reduceRight<number[]>(
    (row, other, col) => [
      line === other
        ? (next[col + 1] ?? 0) + 1
        : Math.max(next[col] ?? 0, row[0] ?? 0),
      ...row,
    ],
    [0],
  );
}
