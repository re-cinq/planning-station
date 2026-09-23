import { partitionSections, planTitle, sectionOrder, } from "../projection/partition.js";
import { toBlocks } from "../projection/to-blocks.js";
/** Rewrites one section's blocks, leaving every other section as it is. */
export function inSection(blocks, slot, change) {
    const sections = partitionSections(blocks).map((section) => section.slot === slot
        ? { ...section, blocks: sectionOrder(change(section)) }
        : section);
    return withSections(blocks, sections);
}
/** The blocks a plan's sections make, keeping the plan's own title. */
export function withSections(blocks, sections) {
    return toBlocks({ sections: [...sections], title: planTitle(blocks) ?? "" });
}
//# sourceMappingURL=in-section.js.map