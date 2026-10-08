import { PROTOTYPE_MATURITIES } from "../blocks/plan-block-configs.js";
import type { PlanDocument } from "../plan/plan-document.js";
import { isAtLeast, type Check, type ValidationPhase } from "./problems.js";

type Maturity = (typeof PROTOTYPE_MATURITIES)[number];

/** A template may ask for a prototype of at least some maturity before approval. */
export const prototypeMinimum: Check = ({ plan, template, phase }) => {
  const minimum = template.prototypeMinimum;
  const declared = plan.prototype?.maturity ?? "none";

  if (!minimum || !asksNow(plan, phase) || meets(declared, minimum)) {
    return [];
  }

  return [
    {
      code: "prototype-below-minimum",
      slot: "prototype",
      message: `the prototype must be at least ${minimum}, it is ${declared}`,
    },
  ];
};

/** Approval asks for the prototype, unless the plan dropped that section. */
function asksNow(plan: PlanDocument, phase: ValidationPhase): boolean {
  return (
    isAtLeast(phase, "approval") && !plan.droppedSlots.includes("prototype")
  );
}

function meets(declared: Maturity, minimum: Maturity): boolean {
  return (
    PROTOTYPE_MATURITIES.indexOf(declared) >=
    PROTOTYPE_MATURITIES.indexOf(minimum)
  );
}
