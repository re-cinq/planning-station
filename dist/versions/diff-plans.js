import { plainText } from "../blocks/inline-text.js";
import { diffLines } from "./diff-lines.js";
export const ENTITY_CHANGES = ["added", "removed", "changed"];
const META_FIELDS = ["title", "status", "version"];
/** What changed between two versions of a plan, in the words people wrote. */
export function diffPlans(before, after) {
    return {
        meta: metaChanges(before, after),
        sections: sectionDiffs(before, after),
        kpis: entityChanges(before.kpis, after.kpis),
    };
}
/** A section with only kept lines is left out, so a diff shows the changes. */
function sectionDiffs(before, after) {
    const was = new Map(before.sections.map((section) => [section.slot, section]));
    const diffs = after.sections.map((section) => ({
        slot: section.slot,
        title: section.title,
        lines: diffLines(linesOf(was.get(section.slot)), linesOf(section)),
    }));
    return diffs.filter((diff) => diff.lines.some((line) => line.kind !== "kept"));
}
/** A table's cells are not prose, so it counts as one unreadable line. */
function linesOf(section) {
    return (section?.blocks ?? []).map((block) => Array.isArray(block.content) ? plainText(block.content) : block.type);
}
function entityChanges(before, after) {
    const was = fingerprints(before);
    const now = fingerprints(after);
    return [
        ...after
            .filter((entity) => was.get(entity.id) !== now.get(entity.id))
            .map((entity) => ({
            id: entity.id,
            kind: was.has(entity.id) ? "changed" : "added",
        })),
        ...before
            .filter((entity) => !now.has(entity.id))
            .map((entity) => ({ id: entity.id, kind: "removed" })),
    ];
}
function fingerprints(entities) {
    return new Map(entities.map((entity) => [entity.id, JSON.stringify(entity)]));
}
function metaChanges(before, after) {
    return META_FIELDS.filter((field) => String(before[field]) !== String(after[field])).map((field) => ({
        field,
        before: String(before[field]),
        after: String(after[field]),
    }));
}
//# sourceMappingURL=diff-plans.js.map