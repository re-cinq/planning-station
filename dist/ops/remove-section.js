import { droppedSlotsOf, partitionSections, planTitle, } from "../projection/partition.js";
import { toBlocks } from "../projection/to-blocks.js";
/** The section goes whole, and the plan remembers its slot so nothing asks for it again. */
export function removeSection(blocks, op) {
    const sections = partitionSections(blocks);
    return sections.some((section) => section.slot === op.slot)
        ? toBlocks({
            sections: sections.filter((section) => section.slot !== op.slot),
            title: planTitle(blocks) ?? "",
            droppedSlots: [...droppedSlotsOf(blocks), op.slot],
        })
        : blocks;
}
//# sourceMappingURL=remove-section.js.map