export declare const LINE_CHANGES: readonly ["kept", "added", "removed"];
export type LineChangeKind = (typeof LINE_CHANGES)[number];
export interface LineChange {
    kind: LineChangeKind;
    text: string;
}
/** The longest common run of lines is kept; everything else is added or removed. */
export declare function diffLines(before: readonly string[], after: readonly string[]): LineChange[];
//# sourceMappingURL=diff-lines.d.ts.map