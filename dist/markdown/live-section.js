import { blocksOfType, isPlanBlock, } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { findSectionSlot } from "../template/templates.js";
/** A heading's own title wins: templates retitle sections, and the agent titles its own. */
export function sectionTitle(section, template) {
    return (section.title ||
        findSectionSlot(template, section.slot)?.title ||
        section.slot);
}
export function liveProse(section) {
    return section.blocks.filter((block) => !isPlanBlock(block));
}
export function kpiInputOf(block) {
    const { kpiId, metric, baseline, target, direction, deadline } = block.props;
    return {
        kpiId,
        metric,
        baseline,
        target,
        direction,
        deadline,
        rationale: plainText(block.content),
    };
}
export function prototypeInputOf(block) {
    const { maturity, url, agreedBy } = block.props;
    return { maturity, url, agreedBy, notes: plainText(block.content) };
}
export function liveKpis(blocks) {
    return new Map(blocksOfType(blocks, "kpi").map((block) => [
        block.props.kpiId,
        kpiInputOf(block),
    ]));
}
export function livePrototype(blocks) {
    const [first] = blocksOfType(blocks, "prototype");
    return first ? prototypeInputOf(first) : null;
}
//# sourceMappingURL=live-section.js.map