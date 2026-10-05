import { PROSE_BLOCK_KINDS } from "../blocks/prose-blocks.js";
import { enforceTrue } from "../lib/enforce.js";
import { newId } from "../lib/ids.js";
import { ALWAYS_ALLOWED, SLOTS } from "./slots.js";
export class UnknownSlotError extends Error {
}
export const TEMPLATES = {
    feature: {
        type: "feature",
        version: 1,
        slots: [
            SLOTS.intent,
            SLOTS.kpis,
            SLOTS.scope,
            SLOTS.prototype,
            SLOTS.constraints,
            SLOTS.ownership,
            SLOTS.delivery,
            SLOTS.questions,
        ],
    },
    "ui-change": {
        type: "ui-change",
        version: 1,
        prototypeMinimum: "click-dummy",
        slots: [
            SLOTS.intent,
            SLOTS.kpis,
            { ...SLOTS.prototype, required: "always" },
            { ...SLOTS.scope, required: "optional" },
            SLOTS.constraints,
            SLOTS.questions,
        ],
    },
    performance: {
        type: "performance",
        version: 1,
        slots: [
            SLOTS.intent,
            {
                ...SLOTS.kpis,
                hint: "Baseline and target are mandatory numbers here: p95, cost, throughput.",
            },
            SLOTS.scope,
            SLOTS.constraints,
            SLOTS.ownership,
            SLOTS.delivery,
            SLOTS.questions,
        ],
    },
    refactor: {
        type: "refactor",
        version: 1,
        slots: [
            SLOTS.intent,
            {
                ...SLOTS.kpis,
                title: "What must stay true",
                hint: "Guardrail KPIs: nothing user-visible moves.",
            },
            SLOTS.scope,
            SLOTS.risk,
            SLOTS.constraints,
            SLOTS.ownership,
            SLOTS.delivery,
            SLOTS.questions,
        ],
    },
    "incident-response": {
        type: "incident-response",
        version: 1,
        slots: [
            SLOTS.trigger,
            SLOTS.intent,
            SLOTS.kpis,
            SLOTS.scope,
            { ...SLOTS.ownership, required: "always" },
            SLOTS.questions,
        ],
    },
};
export function templateFor(type) {
    return TEMPLATES[type];
}
export function slotFor(template, slot) {
    const found = template.slots.find((candidate) => candidate.slot === slot);
    enforceTrue(found, UnknownSlotError, `${template.type} has no slot ${slot}`);
    return found;
}
/** The slot prefix of a section the planning agent added to one plan. */
export const CUSTOM_SLOT_PREFIX = "custom-";
export function isCustomSlot(slot) {
    return slot.startsWith(CUSTOM_SLOT_PREFIX);
}
export function newCustomSlot() {
    return `${CUSTOM_SLOT_PREFIX}${newId("section")}`;
}
/** A section of the template, or one the agent added, under the title its heading carries. */
export function sectionSlotFor(template, slot, title) {
    const found = findSectionSlot(template, slot, title);
    enforceTrue(found, UnknownSlotError, `${template.type} has no slot ${slot}`);
    return found;
}
export function findSectionSlot(template, slot, title = "") {
    const known = template.slots.find((candidate) => candidate.slot === slot);
    return known ?? (isCustomSlot(slot) ? customSlot(slot, title) : undefined);
}
function customSlot(slot, title) {
    return {
        slot,
        title,
        required: "optional",
        allows: [...PROSE_BLOCK_KINDS, ...ALWAYS_ALLOWED],
        requires: [],
        hint: "Added by the planning agent for this plan.",
    };
}
//# sourceMappingURL=templates.js.map