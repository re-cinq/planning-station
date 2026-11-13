import { isPlanBlock } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { applyOps } from "../ops/apply-ops.js";
import { diffLines } from "../lib/diff-lines.js";
import { sectionHash, writtenIn } from "./section-hash.js";
/** What accepting the proposal would do to its section, line by line. */
export function previewProposal(blocks, proposal) {
    const { slot } = proposal;
    const before = writtenIn(blocks, slot).flatMap(linesOf);
    const after = writtenIn(applyOps(blocks, proposal.ops), slot).flatMap(linesOf);
    return {
        lines: diffLines(before, after),
        stale: sectionHash(blocks, slot) !== proposal.baseHash,
    };
}
function linesOf(block) {
    const text = Array.isArray(block.content) ? plainText(block.content) : "";
    const own = isPlanBlock(block) ? [fieldsOf(block), text] : [text];
    const line = own.filter(Boolean).join(" — ");
    const nested = isPlanBlock(block) ? [] : block.children.flatMap(linesOf);
    return [line, ...nested].filter(Boolean);
}
function fieldsOf(block) {
    return Object.entries(block.props)
        .filter(([name, value]) => isShown(name, value))
        .map(([, value]) => String(value))
        .join(" · ");
}
function isShown(name, value) {
    return !name.endsWith("Id") && value !== "" && typeof value !== "boolean";
}
//# sourceMappingURL=proposal-preview.js.map