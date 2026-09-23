import { z } from "zod";
import { newId } from "../lib/ids.js";
import { shortHash } from "../lib/short-hash.js";
import { agentOpSchema } from "../ops/agent-ops.js";
import { plainText } from "../blocks/inline-text.js";
import { refineUsesSchema } from "./refine-proposal.js";
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
/** The pass, cut into one change per op and anchored to the blocks it is about. */
export function changesFor(blocks, pass) {
    const proposedAt = new Date().toISOString();
    return pass.ops.map((op) => ({
        changeId: newId("chg"),
        slot: pass.slot,
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
/** The words a change proposes, one line per block: none for a change that only drops a paragraph, since what goes is the paragraph it hangs under. */
export function changeWords(change) {
    const { op } = change;
    if (op.op === "replace-block") {
        return [wordsOf(op.block)];
    }
    return op.op === "insert-blocks" ? op.blocks.map(wordsOf) : [];
}
/** A table has rows rather than one line of content, and reads as its cells in order. */
function wordsOf(block) {
    if ("content" in block) {
        return plainText(block.content);
    }
    const cells = block.rows.flat();
    return cells.map(plainText).join(" · ");
}
//# sourceMappingURL=plan-change.js.map