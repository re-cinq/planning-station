import { parseBlock, type BlockJson } from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";
import { newId } from "../lib/ids.js";
import { SECTION_ACTIONS } from "../template/slots.js";
import type { PlanTemplate } from "../template/template.js";

export interface SeedOptions {
  /** The feature name, which the plan carries as its title block. */
  title?: string;
  idFor?: (slot: string) => string;
}

/** A new plan: its title, then each section's heading, panel and actions. */
export function seedBlocks(
  template: PlanTemplate,
  options: SeedOptions = {},
): BlockJson[] {
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

export function titleBlock(title: string): BlockJson {
  return parseBlock({
    id: PLAN_TITLE_ID,
    type: "plan-title",
    props: {},
    content: inlineFromText(title),
  });
}

export function panelBlock(slot: string): BlockJson {
  return parseBlock({
    id: `panel-${slot}`,
    type: "section-panel",
    props: { slot },
  });
}

export function actionsBlock(slot: string): BlockJson {
  return parseBlock({
    id: `actions-${slot}`,
    type: SECTION_ACTIONS,
    props: { slot },
  });
}
