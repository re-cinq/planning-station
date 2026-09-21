import { isPlanBlock, parseBlock, } from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";
import { partitionSections, planTitle, sectionOrder, } from "../projection/partition.js";
import { toBlocks } from "../projection/to-blocks.js";
const KPIS_SLOT = "kpis";
const PROTOTYPE_SLOT = "prototype";
const setSectionText = (blocks, op) => inSection(blocks, op.slot, (section) => [
    ...paragraphs(op.slot, op.paragraphs),
    ...section.blocks.filter(isPlanBlock),
]);
const appendToSection = (blocks, op) => inSection(blocks, op.slot, (section) => [
    ...section.blocks,
    ...paragraphs(op.slot, op.paragraphs, section.blocks.length),
]);
const HANDLERS = {
    "set-section-text": setSectionText,
    "append-to-section": appendToSection,
    "upsert-kpi": (blocks, op) => upsert(blocks, KPIS_SLOT, kpiBlock(op.kpi)),
    "set-prototype": (blocks, op) => upsert(blocks, PROTOTYPE_SLOT, prototypeBlock(op.prototype)),
};
/** Applies the planning agent's edits to a plan's blocks. */
export function applyOps(blocks, ops) {
    return ops.reduce(applyOp, [...blocks]);
}
function applyOp(blocks, op) {
    const apply = HANDLERS[op.op];
    return apply(blocks, op);
}
function inSection(blocks, slot, change) {
    const sections = partitionSections(blocks).map((section) => section.slot === slot
        ? { ...section, blocks: sectionOrder(change(section)) }
        : section);
    return toBlocks({ sections, title: planTitle(blocks) ?? "" });
}
function upsert(blocks, slot, block) {
    const index = blocks.findIndex((current) => current.id === block.id);
    if (index < 0) {
        return inSection(blocks, slot, (section) => [...section.blocks, block]);
    }
    return blocks.map((current, at) => (at === index ? block : current));
}
function paragraphs(slot, texts, offset = 0) {
    return texts.map((text, index) => parseBlock({
        id: `${slot}-p-${offset + index + 1}`,
        type: "paragraph",
        props: {},
        content: inlineFromText(text),
    }));
}
function kpiBlock(kpi) {
    const { kpiId, rationale, ...props } = kpi;
    return parseBlock({
        id: kpiId,
        type: "kpi",
        props: { kpiId, ...props },
        content: inlineFromText(rationale),
    });
}
function prototypeBlock(prototype) {
    const { notes, ...props } = prototype;
    return parseBlock({
        id: PROTOTYPE_SLOT,
        type: "prototype",
        props,
        content: inlineFromText(notes),
    });
}
//# sourceMappingURL=apply-ops.js.map