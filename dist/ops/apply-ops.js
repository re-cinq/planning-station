import { encodeOptions } from "../blocks/question-options.js";
import { isPlanBlock, parseBlock, } from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";
import { partitionSections } from "../projection/partition.js";
import { actionsBlock, panelBlock } from "../projection/seed.js";
import { isCustomSlot } from "../template/templates.js";
import { insertBlocks, removeBlock, replaceBlock } from "./block-ops.js";
import { inSection, withSections } from "./in-section.js";
import { toProseBlocks } from "./prose-input.js";
const KPIS_SLOT = "kpis";
const PROTOTYPE_SLOT = "prototype";
const setSectionText = (blocks, op) => withProse(blocks, op.slot, paragraphs(op.slot, op.paragraphs));
const setSectionProse = (blocks, op) => withProse(blocks, op.slot, toProseBlocks(op.slot, op.blocks));
const appendToSection = (blocks, op) => inSection(blocks, op.slot, (section) => [
    ...section.blocks,
    ...paragraphs(op.slot, op.paragraphs, section.blocks.length),
]);
const addSection = (blocks, op) => {
    const sections = partitionSections(blocks);
    const after = sections.findIndex((section) => section.slot === op.after);
    const taken = sections.some((section) => section.slot === op.slot);
    return after < 0 || taken || !isCustomSlot(op.slot)
        ? blocks
        : withSections(blocks, sections.toSpliced(after + 1, 0, newSection(op)));
};
const setSectionTitle = (blocks, op) => blocks.map((block) => block.type === "section-heading" &&
    block.props.slot === op.slot &&
    isCustomSlot(op.slot)
    ? parseBlock({ ...block, props: { ...block.props, title: op.title } })
    : block);
const HANDLERS = {
    "set-section-text": setSectionText,
    "set-section-prose": setSectionProse,
    "append-to-section": appendToSection,
    "upsert-kpi": (blocks, op) => upsert(blocks, KPIS_SLOT, kpiBlock(op.kpi)),
    "set-prototype": (blocks, op) => upsert(blocks, PROTOTYPE_SLOT, prototypeBlock(op.prototype)),
    "replace-block": replaceBlock,
    "insert-blocks": insertBlocks,
    "remove-block": removeBlock,
    "add-section": addSection,
    "set-section-title": setSectionTitle,
    "add-question": (blocks, op) => upsert(blocks, op.slot, questionBlock(op)),
};
/** Applies the planning agent's edits to a plan's blocks. */
export function applyOps(blocks, ops) {
    return ops.reduce(applyOp, [...blocks]);
}
function applyOp(blocks, op) {
    const apply = HANDLERS[op.op];
    return apply(blocks, op);
}
/** A section's prose is replaced whole, and the plan blocks in it stay. */
function withProse(blocks, slot, prose) {
    return inSection(blocks, slot, (section) => [
        ...prose,
        ...section.blocks.filter(isPlanBlock),
    ]);
}
function newSection(op) {
    return {
        headingId: `heading-${op.slot}`,
        slot: op.slot,
        title: op.title,
        blocks: [
            panelBlock(op.slot),
            ...paragraphs(op.slot, op.paragraphs),
            actionsBlock(op.slot),
        ],
    };
}
function upsert(blocks, slot, block) {
    const index = blocks.findIndex((current) => isSameEntity(current, block));
    if (index < 0) {
        return inSection(blocks, slot, (section) => [...section.blocks, block]);
    }
    return blocks.map((current, at) => at === index ? { ...block, id: current.id } : current);
}
// A block people made in the editor has an id of its own, so an entity is found by its key too.
const ENTITY_KEYS = {
    kpi: (block) => propOf(block, "kpiId"),
    question: (block) => propOf(block, "questionId"),
    prototype: () => PROTOTYPE_SLOT,
};
function propOf(block, name) {
    return String(block.props[name]);
}
function isSameEntity(current, next) {
    const keyOf = ENTITY_KEYS[next.type];
    return (current.id === next.id ||
        (current.type === next.type &&
            keyOf !== undefined &&
            keyOf(current) === keyOf(next)));
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
function questionBlock(input) {
    const { questionId, question, why, kind, options } = input;
    return parseBlock({
        id: questionId,
        type: "question",
        props: { questionId, why, kind, options: encodeOptions(options) },
        content: inlineFromText(question),
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