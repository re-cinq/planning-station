import { parseBlock } from "../blocks/block-json.js";
import { titleBlock } from "./seed.js";
export function toBlocks(plan) {
    const sections = plan.sections.flatMap((section) => [
        sectionHeading(section),
        ...section.blocks,
    ]);
    return plan.title ? [titleBlock(plan.title), ...sections] : sections;
}
function sectionHeading(section) {
    return parseBlock({
        id: section.headingId,
        type: "section-heading",
        props: { slot: section.slot, title: section.title },
    });
}
//# sourceMappingURL=to-blocks.js.map