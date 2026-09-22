import { blocksOfType, isPlanBlock, } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { findSectionSlot } from "../template/templates.js";
import { groupParagraphs } from "./markdown-syntax.js";
/** A heading's own title wins: templates retitle sections, and the agent titles its own. */
export function sectionTitle(section, template) {
    return (section.title ||
        findSectionSlot(template, section.slot)?.title ||
        section.slot);
}
/** A prose block and its nested blocks flattened to their text, one entry each; a table has none. */
export function proseTexts(block) {
    const own = Array.isArray(block.content) ? plainText(block.content) : "";
    return [own, ...block.children.flatMap(proseTexts)];
}
/** What a section's prose reads as once written out and read back. */
export function proseParagraphs(section) {
    const prose = section.blocks.filter((block) => !isPlanBlock(block));
    return groupParagraphs(proseLines(prose.flatMap(proseTexts)));
}
/** Each prose text as its lines, closed by the blank line that parts it from the next. */
function proseLines(texts) {
    return texts.flatMap((text) => [...text.split("\n"), ""]);
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