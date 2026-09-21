import { enforceTrue } from "../lib/enforce.js";
import type { PlanKind } from "../plan/plan-meta.js";
import { SLOTS } from "./slots.js";
import type { PlanTemplate, SectionSlot } from "./template.js";

export class UnknownSlotError extends Error {}

export const TEMPLATES: Readonly<Record<PlanKind, PlanTemplate>> = {
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

export function templateFor(type: PlanKind): PlanTemplate {
  return TEMPLATES[type];
}

export function slotFor(template: PlanTemplate, slot: string): SectionSlot {
  const found = template.slots.find((candidate) => candidate.slot === slot);
  enforceTrue(found, UnknownSlotError, `${template.type} has no slot ${slot}`);

  return found;
}
