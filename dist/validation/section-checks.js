import { isPlanBlock } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { allowsBlock, disallowedBlockMessage, NOT_CONTENT, } from "../template/slots.js";
import { findSectionSlot, isCustomSlot } from "../template/templates.js";
import { isAtLeast, isRequiredAt, } from "./problems.js";
export const missingSections = ({ plan: { sections }, template: { slots }, phase, }) => {
    const present = new Set(sections.map((section) => section.slot));
    return slots
        .filter((slot) => isRequiredAt(slot.required, phase) && !present.has(slot.slot))
        .map((slot) => ({
        code: "missing-section",
        slot: slot.slot,
        message: `"${slot.title}" is missing`,
    }));
};
export const unknownSections = ({ plan: { sections }, template }) => {
    const known = new Set(template.slots.map((slot) => slot.slot));
    return sections
        .filter((section) => !known.has(section.slot) && !isCustomSlot(section.slot))
        .map((section) => ({
        code: "unknown-section",
        slot: section.slot,
        message: `"${section.title}" is not part of the ${template.type} template`,
    }));
};
export const sectionOrder = ({ plan: { sections }, template }) => {
    const rank = new Map(template.slots.map((slot, index) => [slot.slot, index]));
    const ranked = sections.filter((section) => rank.has(section.slot));
    return ranked
        .filter((section, index) => index > 0 && rankOf(rank, section) <= rankOf(rank, ranked[index - 1]))
        .map((section) => ({
        code: "section-out-of-order",
        slot: section.slot,
        message: `"${section.title}" is out of template order`,
    }));
};
export const disallowedBlocks = ({ plan: { sections }, template }) => sectionsWithSlots(sections, template).flatMap(({ section: { blocks }, slot }) => blocks
    .filter((block) => !allowsBlock(slot, block.type))
    .map((block) => ({
    code: "disallowed-block",
    slot: slot.slot,
    blockId: block.id,
    message: disallowedBlockMessage(slot, block.type),
})));
export const emptyRequiredSections = ({ plan: { sections }, template, phase, }) => isAtLeast(phase, "approval")
    ? requiredSections(sections, template, phase)
        .filter(({ section }) => !section.blocks.some(isMeaningful))
        .map(({ slot }) => ({
        code: "empty-required-section",
        slot: slot.slot,
        message: `"${slot.title}" needs content`,
    }))
    : [];
export const blockRequirements = ({ plan: { sections }, template, phase, }) => isAtLeast(phase, "approval")
    ? requiredSections(sections, template, phase).flatMap(({ section, slot }) => slot.requires.flatMap((requirement) => countProblems(section.blocks, slot, requirement)))
    : [];
function countProblems(blocks, slot, requirement) {
    const count = blocks.filter((block) => block.type === requirement.block).length;
    const code = countCode(count, requirement);
    return code
        ? [
            {
                code,
                slot: slot.slot,
                message: countMessage(code, slot, requirement),
            },
        ]
        : [];
}
function countCode(count, requirement) {
    if (count < requirement.min) {
        return "missing-block";
    }
    const tooMany = requirement.max !== undefined && count > requirement.max;
    return tooMany ? "too-many-blocks" : null;
}
function countMessage(code, slot, requirement) {
    const { min, max, block } = requirement;
    return code === "missing-block"
        ? `"${slot.title}" needs at least ${min} ${block}`
        : `"${slot.title}" allows at most ${max ?? min} ${block}`;
}
function sectionsWithSlots(sections, template) {
    return sections.flatMap((section) => {
        const slot = findSectionSlot(template, section.slot, section.title);
        return slot ? [{ section, slot }] : [];
    });
}
function requiredSections(sections, template, phase) {
    return sectionsWithSlots(sections, template).filter(({ slot }) => isRequiredAt(slot.required, phase));
}
function rankOf(rank, section) {
    return rank.get(section?.slot ?? "") ?? -1;
}
function isMeaningful(block) {
    if (NOT_CONTENT.includes(block.type)) {
        return false;
    }
    if (isPlanBlock(block) || block.children.length > 0) {
        return true;
    }
    return Array.isArray(block.content)
        ? plainText(block.content).trim() !== ""
        : true;
}
//# sourceMappingURL=section-checks.js.map