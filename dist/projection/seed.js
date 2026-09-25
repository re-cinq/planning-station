import { parseBlock } from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";
import { newId } from "../lib/ids.js";
import { SECTION_ACTIONS } from "../template/slots.js";
/** A new plan: its title, then each section's heading, panel and actions. */
export function seedBlocks(template, options = {}) {
    const idFor = options.idFor ?? (() => newId("sec"));
    return [
        titleBlock(options.title ?? ""),
        ...template.slots.flatMap((slot) => [
            parseBlock({
                id: idFor(slot.slot),
                type: "section-heading",
                props: { slot: slot.slot, title: slot.title },
            }),
            panelBlock(slot.slot),
            actionsBlock(slot.slot),
        ]),
    ];
}
export const PLAN_TITLE_ID = "plan-title";
export function titleBlock(title) {
    return parseBlock({
        id: PLAN_TITLE_ID,
        type: "plan-title",
        props: {},
        content: inlineFromText(title),
    });
}
export function panelBlock(slot) {
    return parseBlock({
        id: `panel-${slot}`,
        type: "section-panel",
        props: { slot },
    });
}
export function actionsBlock(slot) {
    return parseBlock({
        id: `actions-${slot}`,
        type: SECTION_ACTIONS,
        props: { slot },
    });
}
//# sourceMappingURL=seed.js.map