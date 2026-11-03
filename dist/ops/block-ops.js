// One block at a time (paragraph-level proposals): the id is the anchor, so an edit lands where its author meant it even when the section moved around it. A block that is gone is left alone rather than re-created: someone deleted it, and this change was written against a plan that still had it.
import { newId } from "../lib/ids.js";
import { inSection } from "./in-section.js";
import { toProseBlocks } from "./prose-input.js";
export const replaceBlock = (blocks, op) => inSection(blocks, op.slot, (section) => section.blocks.map((block) => block.id === op.blockId
    ? { ...proseBlockOf(op.slot, op.block), id: block.id }
    : block));
export const insertBlocks = (blocks, op) => inSection(blocks, op.slot, (section) => section.blocks.flatMap((block, index) => placedAfter(block, index, op) ? [block, ...inserted(op)] : [block]));
export const removeBlock = (blocks, op) => inSection(blocks, op.slot, (section) => section.blocks.filter((block) => block.id !== op.blockId));
/** True for the block the insert follows — the named one, or the first block when it follows nothing. */
function placedAfter(block, index, op) {
    return op.after === null ? index === 0 : block.id === op.after;
}
function inserted(op) {
    return toProseBlocks(op.slot, op.blocks).map((block) => ({
        ...block,
        id: newId("p"),
    }));
}
function proseBlockOf(slot, input) {
    return toProseBlocks(slot, [input])[0];
}
//# sourceMappingURL=block-ops.js.map