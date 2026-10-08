import { describe, it, expect } from "vitest";

import { toPlanDocument } from "../projection/to-plan-document.js";
import { planMeta, planWith } from "../testing/plans.js";
import type { AgentOp } from "./agent-ops.js";
import { applyOps } from "./apply-ops.js";

const SEEDED = planWith("feature", {});

const planOf = (ops: AgentOp[]) =>
  toPlanDocument(applyOps(SEEDED, ops), planMeta("feature"));

describe("applyOps remove-section", () => {
  it("removes the prototype section and records prototype as dropped", () => {
    const plan = planOf([{ op: "remove-section", slot: "prototype" }]);
    expect({
      slots: plan.sections.map(({ slot }) => slot),
      droppedSlots: plan.droppedSlots,
    }).toEqual({
      slots: [
        "intent",
        "kpis",
        "scope",
        "constraints",
        "ownership",
        "delivery",
        "questions",
      ],
      droppedSlots: ["prototype"],
    });
  });

  it("keeps prototype and delivery dropped through a later intent write", () => {
    const plan = planOf([
      { op: "remove-section", slot: "prototype" },
      { op: "remove-section", slot: "delivery" },
      { op: "set-section-text", slot: "intent", paragraphs: ["Slow."] },
    ]);
    expect(plan.droppedSlots).toEqual(["prototype", "delivery"]);
  });

  it("leaves the plan alone when the risk section is not in it", () => {
    expect(applyOps(SEEDED, [{ op: "remove-section", slot: "risk" }])).toEqual(
      SEEDED,
    );
  });
});
