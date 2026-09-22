export const MARKDOWN_PROBLEM_CODES = [
    "unknown-section",
    "duplicate-section",
    "renamed-template-section",
    "untitled-section",
    "invalid-fence",
    "unknown-fence",
];
export const NO_CHANGE = { ops: [], problems: [] };
export function changed(op) {
    return { ops: [op], problems: [] };
}
export function problem(code, slot, message) {
    return { ops: [], problems: [{ code, slot, message }] };
}
export function merged(outcomes) {
    return {
        ops: outcomes.flatMap((outcome) => outcome.ops),
        problems: outcomes.flatMap((outcome) => outcome.problems),
    };
}
//# sourceMappingURL=markdown-outcome.js.map