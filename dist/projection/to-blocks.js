import { parseBlock } from "../blocks/block-json.js";
import { titleBlock } from "./seed.js";
export function toBlocks(plan) {
    const sections = plan.sections.flatMap((section) => [
        sectionHeading(section),
        ...section.blocks,
    ]);
    const droppedSlots = plan.droppedSlots ?? [];
    return plan.title || droppedSlots.length > 0
        ? [titleBlock(plan.title ?? "", droppedSlots), ...sections]
        : sections;
}
function sectionHeading(section) {
    return parseBlock({
        id: section.headingId,
        type: "section-heading",
        props: { slot: section.slot, title: section.title },
    });
}
//# sourceMappingURL=to-blocks.js.map