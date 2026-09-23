import { PROSE_BLOCK_KINDS } from "../blocks/prose-blocks.js";
import type { SectionSlot } from "./template.js";

const PROSE = PROSE_BLOCK_KINDS;

/** Blocks every section carries, whatever its template says. */
export const ALWAYS_ALLOWED = [
  "section-panel",
  "section-actions",
  "question",
  "answer",
  "comment",
] as const;

/** Margin notes: they lead a section in this order. */
export const MARGIN_NOTES: readonly string[] = ["comment", "section-panel"];

/** Closes every section, under what people wrote. */
export const SECTION_ACTIONS = "section-actions";

/** A section holding only these is still an empty section. */
export const NOT_CONTENT: readonly string[] = [
  ...MARGIN_NOTES,
  SECTION_ACTIONS,
];

export const SLOTS = {
  intent: {
    slot: "intent",
    title: "What we want and why",
    required: "always",
    allows: PROSE,
    requires: [],
    hint: "Two paragraphs a director would read. No implementation.",
  },
  kpis: {
    slot: "kpis",
    title: "Success criteria",
    required: "always",
    allows: [...PROSE, "kpi"],
    requires: [{ block: "kpi", min: 1 }],
    hint: "Each KPI: the metric, where it is now, where it must be, and by when.",
  },
  scope: {
    slot: "scope",
    title: "In and out of scope",
    required: "for-approval",
    allows: PROSE,
    requires: [],
    hint: "What this plan changes, and what it deliberately leaves alone.",
  },
  prototype: {
    slot: "prototype",
    title: "Prototype",
    required: "for-approval",
    allows: [...PROSE, "prototype", "mockup"],
    requires: [{ block: "prototype", min: 1, max: 1 }],
    hint: "Agree the maturity first: click-dummy or running-prototype.",
  },
  constraints: {
    slot: "constraints",
    title: "Constraints",
    required: "optional",
    allows: PROSE,
    requires: [],
    hint: "Budgets, deadlines, regulation, technology that is ruled out.",
  },
  ownership: {
    slot: "ownership",
    title: "Who operates it",
    required: "for-approval",
    allows: PROSE,
    requires: [],
    hint: "The team that runs this in production and answers the pager.",
  },
  delivery: {
    slot: "delivery",
    title: "Delivery implications",
    required: "optional",
    allows: PROSE,
    requires: [],
    hint: "Rollout, migrations, communication, other teams involved.",
  },
  risk: {
    slot: "risk",
    title: "What could break",
    required: "for-approval",
    allows: PROSE,
    requires: [],
    hint: "The blast radius if this goes wrong, and how we would notice.",
  },
  trigger: {
    slot: "trigger",
    title: "What happened",
    required: "always",
    allows: PROSE,
    requires: [],
    hint: "The incident or signal that started this plan, with links.",
  },
  questions: {
    slot: "questions",
    title: "Open questions",
    required: "optional",
    allows: ["question", "answer", "paragraph"],
    requires: [],
    hint: "What the agent needs a person to decide.",
  },
} as const satisfies Record<string, SectionSlot>;

/** Whether a section of this slot may hold a block of this type: what its template allows, or what every section carries. */
export function allowsBlock(slot: SectionSlot, type: string): boolean {
  return (
    (slot.allows as readonly string[]).includes(type) ||
    ALWAYS_ALLOWED.includes(type as (typeof ALWAYS_ALLOWED)[number])
  );
}

export function disallowedBlockMessage(
  slot: SectionSlot,
  type: string,
): string {
  return `a ${type} block does not belong in "${slot.title}"`;
}
