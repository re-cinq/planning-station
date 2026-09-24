import { z } from "zod";
import { newId } from "../lib/ids.js";
import { shortHash } from "../lib/short-hash.js";
import { agentOpSchema, } from "../ops/agent-ops.js";
import { plainText } from "../blocks/inline-text.js";
import { refineUsesSchema, slotOf, } from "./refine-proposal.js";
/** One change a pass proposes, about ONE block: reviewed, accepted and refused on its own, where it lands. */
export const planChangeSchema = z.object({
    changeId: z.string().min(1),
    slot: z.string().min(1),
    /** The block this change is about: the one it rewrites or drops, the one new blocks follow, or null for the top of the section. */
    anchorId: z.string().nullable(),
    /** That block as the agent read it; the change is stale once it reads otherwise. */
    baseHash: z.string(),
    op: agentOpSchema,
    uses: refineUsesSchema,
    proposedBy: z.string(),
    proposedAt: z.string(),
});
/** The pass, cut into one change per op, each filed under the section it writes and anchored to the block it is about. */
export function changesFor(blocks, pass) {
    const proposedAt = new Date().toISOString();
    return pass.ops.map((op) => ({
        changeId: newId("chg"),
        slot: slotOf(op),
        anchorId: anchorOf(op),
        baseHash: blockHash(blocks, anchorOf(op)),
        op,
        uses: pass.uses,
        proposedBy: pass.proposedBy,
        proposedAt,
    }));
}
/** The block an op is about: the one it rewrites or drops, or the one its new blocks follow. */
export function anchorOf(op) {
    if (op.op === "replace-block" || op.op === "remove-block") {
        return op.blockId;
    }
    return op.op === "insert-blocks" ? op.after : null;
}
/** One block as it reads now, hashed; empty for a block the plan no longer holds, or for no block at all. */
export function blockHash(blocks, blockId) {
    const block = blockId
        ? blocks.find((candidate) => candidate.id === blockId)
        : undefined;
    return block ? shortHash(JSON.stringify(block)) : "";
}
/** The words a change proposes, as the lines its preview shows: none for a removal, since what goes is the paragraph it hangs under. */
export function changeWords(change) {
    const read = WORDS[change.op.op];
    return read(change.op);
}
const WORDS = {
    "set-section-text": paragraphWords,
    "set-section-prose": blockWords,
    "append-to-section": paragraphWords,
    "upsert-kpi": kpiWords,
    "set-prototype": prototypeWords,
    "replace-block": rewriteWords,
    "insert-blocks": blockWords,
    "remove-block": noWords,
    "add-section": sectionWords,
    "set-section-title": titleWords,
    "add-question": questionWords,
};
function paragraphWords(op) {
    return op.paragraphs;
}
function blockWords(op) {
    return op.blocks.flatMap(linesOf);
}
function rewriteWords(op) {
    return linesOf(op.block);
}
function titleWords(op) {
    return [op.title];
}
function sectionWords(op) {
    return [...titleWords(op), ...paragraphWords(op)];
}
/** A KPI the agent has only named reads as its name, not as blanks around an arrow. */
function kpiWords({ kpi }) {
    const movement = kpi.baseline || kpi.target ? `: ${kpi.baseline} → ${kpi.target}` : "";
    const deadline = kpi.deadline ? ` by ${kpi.deadline}` : "";
    return [`${kpi.metric}${movement}${deadline}`];
}
function prototypeWords({ prototype, }) {
    const url = prototype.url ? `: ${prototype.url}` : "";
    return [`Prototype (${prototype.maturity})${url}`];
}
function noWords() {
    return [];
}
function questionWords(op) {
    return [op.question];
}
/** A block's own line, then its nested children's lines, in order; a table reads as its cells in one line. */
function linesOf(block) {
    if (!("content" in block)) {
        const cells = block.rows.flat();
        return [cells.map(plainText).join(" · ")];
    }
    const children = "children" in block ? block.children : [];
    return [plainText(block.content), ...children.flatMap(linesOf)];
}
//# sourceMappingURL=plan-change.js.map