import { describe, it, expect } from "vitest";

import type { BlockJson } from "../blocks/block-json.js";
import type { PlanMeta, PlanKind } from "../plan/plan-meta.js";
import { applyOps } from "../ops/apply-ops.js";
import { seedBlocks } from "../projection/seed.js";
import { toPlanDocument } from "../projection/to-plan-document.js";
import { templateFor } from "../template/templates.js";
import { block, heading, paragraph } from "../testing/block-builders.js";
import type { ValidationPhase } from "./problems.js";
import { validatePlan } from "./validate-plan.js";

const meta = (type: PlanKind): PlanMeta => ({
  schemaVersion: 1,
  id: "p1",
  repo: "acme/shop",
  type,
  templateVersion: 1,
  title: "Faster checkout",
  status: "draft",
  approval: null,
  version: 1,
  createdBy: "octocat",
  updatedAt: "2026-09-19T10:00:00.000Z",
});

const plan = (blocks: BlockJson[], type: PlanKind = "feature") =>
  toPlanDocument(blocks, meta(type));

const codes = (
  blocks: BlockJson[],
  phase: ValidationPhase,
  type: PlanKind = "feature",
) =>
  validatePlan(plan(blocks, type), phase).problems.map((problem) => [
    problem.code,
    problem.slot,
  ]);

const READY_FEATURE: BlockJson[] = [
  heading("intent", "What we want and why"),
  paragraph("Checkout takes too long.", "intent-text"),
  heading("kpis", "Success criteria"),
  block("kpi", { kpiId: "k1", metric: "p95" }),
  heading("scope", "In and out of scope"),
  paragraph("Only the price lookup."),
  heading("prototype", "Prototype"),
  block("prototype", { maturity: "click-dummy" }),
  heading("ownership", "Who operates it"),
  paragraph("Team checkout."),
];

const UNTIL_PROTOTYPE = 8;

describe("validatePlan", () => {
  it("passes the ready feature fixture at approval", () => {
    expect(validatePlan(plan(READY_FEATURE), "approval")).toEqual({
      passed: true,
      phase: "approval",
      problems: [],
    });
  });

  it("passes a freshly seeded feature plan at draft", () => {
    expect(
      validatePlan(plan(seedBlocks(templateFor("feature"))), "draft").passed,
    ).toBe(true);
  });

  it("reports the empty required sections of a seeded plan at approval", () => {
    expect(codes(seedBlocks(templateFor("feature")), "approval")).toEqual([
      ["empty-required-section", "intent"],
      ["empty-required-section", "kpis"],
      ["empty-required-section", "scope"],
      ["empty-required-section", "prototype"],
      ["empty-required-section", "ownership"],
      ["missing-block", "kpis"],
      ["missing-block", "prototype"],
    ]);
  });

  it("allows a comment in a section whose template never mentions comments", () => {
    const commented = [
      heading("intent", "What we want and why"),
      block("comment", { commentId: "c1", author: "ana" }, { text: "why?" }),
    ];
    expect(
      codes(commented, "draft").filter(([code]) => code === "disallowed-block"),
    ).toEqual([]);
  });

  it("allows a finding in a section whose template never mentions findings", () => {
    const withFinding = applyOps(seedBlocks(templateFor("feature")), [
      {
        op: "add-finding",
        slot: "intent",
        findingId: "f-1",
        text: "The plan promises Danish status labels but names none",
        why: "FR-166 keys the card on fixed text",
        severity: "blocker",
      },
    ]);
    expect(
      codes(withFinding, "draft").filter(([code]) => code === "disallowed-block"),
    ).toEqual([]);
  });

  it("reports an unresolved finding in intent as a blocker at approval", () => {
    const withFinding = applyOps(READY_FEATURE, [
      {
        op: "add-finding",
        slot: "intent",
        findingId: "f-abc123",
        text: "The plan promises Danish status labels but names none",
        why: "FR-166 keys the card on fixed text",
        severity: "blocker",
      },
    ]);
    const report = validatePlan(plan(withFinding), "approval");
    expect(
      report.problems.filter((problem) => problem.code === "unresolved-finding"),
    ).toMatchObject([{ code: "unresolved-finding", slot: "intent", blockId: "f-abc123" }]);
    expect(report.passed).toBe(false);
  });

  it("reports missing-section for a plan without the kpis heading at draft", () => {
    expect(codes([heading("intent", "What we want and why")], "draft")).toEqual(
      [["missing-section", "kpis"]],
    );
  });

  it("reports a risk section on a feature plan as unknown", () => {
    expect(
      codes([...READY_FEATURE, heading("risk", "What could break")], "draft"),
    ).toEqual([["unknown-section", "risk"]]);
  });

  it("passes a ready feature with the agent's Rollout section at approval", () => {
    const withRollout = [
      ...READY_FEATURE.slice(0, 2),
      heading("custom-rollout", "Rollout"),
      paragraph("Ship behind a flag."),
      block("question", { questionId: "q-flag" }, { text: "Which flag?" }),
      ...READY_FEATURE.slice(2),
    ];
    expect(validatePlan(plan(withRollout), "approval")).toEqual({
      passed: true,
      phase: "approval",
      problems: [],
    });
  });

  it("reports a KPI block inside the custom Rollout section as disallowed", () => {
    expect(
      codes(
        [...READY_FEATURE, heading("custom-rollout", "Rollout"), block("kpi")],
        "draft",
      ),
    ).toEqual([["disallowed-block", "custom-rollout"]]);
  });

  it("reports kpis placed after scope as out of order", () => {
    expect(
      codes(
        [
          heading("intent", "Intent"),
          heading("scope", "Scope"),
          heading("kpis", "Success criteria"),
        ],
        "draft",
      ),
    ).toEqual([["section-out-of-order", "kpis"]]);
  });

  it("reports a KPI block inside the intent section as disallowed", () => {
    expect(
      codes(
        [heading("intent", "Intent"), block("kpi"), heading("kpis", "KPIs")],
        "draft",
      ),
    ).toEqual([["disallowed-block", "intent"]]);
  });

  it("does not count a whitespace-only paragraph as intent content", () => {
    const blocks = READY_FEATURE.map((candidate) =>
      candidate.id === "intent-text" ? paragraph("   ") : candidate,
    );
    expect(codes(blocks, "approval")).toEqual([
      ["empty-required-section", "intent"],
    ]);
  });

  it("reports two prototype blocks as too many", () => {
    expect(
      codes(
        [
          ...READY_FEATURE.slice(0, UNTIL_PROTOTYPE),
          block("prototype"),
          ...READY_FEATURE.slice(UNTIL_PROTOTYPE),
        ],
        "approval",
      ),
    ).toEqual([["too-many-blocks", "prototype"]]);
  });

  it("reports a ui-change prototype of maturity none as below click-dummy", () => {
    const blocks = [
      heading("intent", "Intent"),
      paragraph("New header"),
      heading("kpis", "KPIs"),
      block("kpi"),
      heading("prototype", "Prototype"),
      block("prototype", { maturity: "none" }),
    ];
    expect(codes(blocks, "approval", "ui-change")).toEqual([
      ["prototype-below-minimum", "prototype"],
    ]);
  });
});
