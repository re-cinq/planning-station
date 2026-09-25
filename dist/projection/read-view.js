import { isPlanBlock } from "../blocks/block-json.js";
import { blockHash } from "../blocks/block-hash.js";
import { plainText } from "../blocks/inline-text.js";
import { NOT_CONTENT } from "../template/slots.js";
import { partitionSections } from "./partition.js";
/** The plan as a person reads it: one section per slot, with its own blocks and their content only. */
export function readView(blocks) {
    return {
        sections: partitionSections(blocks).map((section) => readSection(blocks, section)),
    };
}
function readSection(blocks, section) {
    const content = section.blocks.filter((block) => !NOT_CONTENT.includes(block.type));
    return {
        slot: section.slot,
        title: section.title,
        blocks: content.map((block) => readBlock(blocks, block)),
    };
}
function readBlock(blocks, block) {
    const text = Array.isArray(block.content) ? plainText(block.content) : "";
    return {
        id: block.id,
        type: block.type,
        hash: blockHash(blocks, block.id),
        text,
        ...(isPlanBlock(block) ? { props: block.props } : {}),
    };
}
//# sourceMappingURL=read-view.js.map