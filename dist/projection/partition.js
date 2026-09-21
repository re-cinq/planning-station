import {} from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { enforceTrue } from "../lib/enforce.js";
import { MARGIN_NOTES, SECTION_ACTIONS } from "../template/slots.js";
export class PlanShapeError extends Error {
}
export const TITLE_BLOCK = "plan-title";
/** The feature name, which lives in the document above the first section. */
export function planTitle(blocks) {
    const title = blocks.find((block) => block.type === TITLE_BLOCK);
    return title && Array.isArray(title.content)
        ? plainText(title.content).trim()
        : null;
}
export function partitionSections(blocks) {
    return blocks
        .filter((block) => block.type !== TITLE_BLOCK)
        .reduce((sections, block) => {
        if (block.type === "section-heading") {
            return [...sections, openSection(block.id, block.props)];
        }
        const current = sections.at(-1);
        enforceTrue(current, PlanShapeError, `block ${block.id} precedes the first section heading`);
        return [
            ...sections.slice(0, -1),
            { ...current, blocks: [...current.blocks, block] },
        ];
    }, []);
}
/** A section's blocks in place: comments, its panel, what people wrote, its actions. */
export function sectionOrder(blocks) {
    const ofKind = (kind) => blocks.filter((block) => block.type === kind);
    const notes = MARGIN_NOTES.flatMap(ofKind);
    const actions = ofKind(SECTION_ACTIONS);
    const placed = [...notes, ...actions];
    return [
        ...notes,
        ...blocks.filter((block) => !placed.includes(block)),
        ...actions,
    ];
}
function openSection(headingId, props) {
    return { headingId, slot: props.slot, title: props.title, blocks: [] };
}
//# sourceMappingURL=partition.js.map