import { describe, it, expect } from "vitest";

import type { PlanDocument } from "../plan/plan-document.js";
import { toPlanDocument } from "../projection/to-plan-document.js";
import { planMeta, planWith, textBlock } from "../testing/plans.js";
import { diffLines } from "../lib/diff-lines.js";
import { diffPlans } from "./diff-plans.js";

const planOf = (
  intent: string[],
  kpis: Parameters<typeof planWith>[1]["kpis"] = [],
) =>
  toPlanDocument(
    planWith("feature", {
      intent: intent.map((text) => textBlock("paragraph", {}, text)),
      kpis,
    }),
    planMeta("feature"),
  );

const kpi = (target: string) =>
  textBlock("kpi", { kpiId: "k1", metric: "p95", target }, "why");

const BEFORE = planOf(["Checkout is slow.", "Mobile suffers most."]);

const sectionOf = (diff: ReturnType<typeof diffPlans>, slot: string) =>
  diff.sections.find((section) => section.slot === slot);

describe("diffLines", () => {
  it("keeps the line both versions share and marks the new one added", () => {
    expect(diffLines(["one"], ["one", "two"])).toEqual([
      { kind: "kept", text: "one" },
      { kind: "added", text: "two" },
    ]);
  });

  it("marks a line only the earlier version had as removed", () => {
    expect(diffLines(["one", "two"], ["two"])).toEqual([
      { kind: "removed", text: "one" },
      { kind: "kept", text: "two" },
    ]);
  });

  it("keeps the longest common run when a line in the middle changed", () => {
    expect(diffLines(["a", "b", "c"], ["a", "x", "c"])).toEqual([
      { kind: "kept", text: "a" },
      { kind: "removed", text: "b" },
      { kind: "added", text: "x" },
      { kind: "kept", text: "c" },
    ]);
  });
});

describe("diffPlans", () => {
  it("shows the added paragraph of the section that grew", () => {
    const after = planOf([
      "Checkout is slow.",
      "Mobile suffers most.",
      "We lose a point of conversion.",
    ]);
    expect(sectionOf(diffPlans(BEFORE, after), "intent")?.lines).toContainEqual(
      {
        kind: "added",
        text: "We lose a point of conversion.",
      },
    );
  });

  it("leaves out the sections nobody touched", () => {
    const after = planOf([
      "Checkout is slow.",
      "Mobile suffers most.",
      "More.",
    ]);
    expect(diffPlans(BEFORE, after).sections.map((one) => one.slot)).toEqual([
      "intent",
    ]);
  });

  it("names the KPI that was added", () => {
    expect(diffPlans(BEFORE, planOf([], [kpi("200 ms")])).kpis).toEqual([
      { id: "k1", kind: "added" },
    ]);
  });

  it("names the KPI whose target moved as changed", () => {
    const before = planOf([], [kpi("200 ms")]);
    expect(diffPlans(before, planOf([], [kpi("150 ms")])).kpis).toEqual([
      { id: "k1", kind: "changed" },
    ]);
  });

  it("names the KPI that is gone as removed", () => {
    const before = planOf([], [kpi("200 ms")]);
    expect(diffPlans(before, planOf([])).kpis).toEqual([
      { id: "k1", kind: "removed" },
    ]);
  });

  it("reports the plan's move from draft to approved with its version", () => {
    const approved: PlanDocument = {
      ...BEFORE,
      status: "approved",
      version: 2,
    };
    expect(diffPlans(BEFORE, approved).meta).toEqual([
      { field: "status", before: "draft", after: "approved" },
      { field: "version", before: "1", after: "2" },
    ]);
  });
});
