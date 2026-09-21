import { describe, it, expect } from "vitest";

import { blocksOfType, type BlockJson } from "../blocks/block-json.js";
import {
  blockText,
  planMeta,
  planWith,
  textBlock,
  writtenBlocks,
} from "../testing/plans.js";
import { toPlanDocument } from "../projection/to-plan-document.js";
import type { AgentOp } from "./agent-ops.js";
import { applyOps } from "./apply-ops.js";

const SEEDED = planWith("feature", {});

const LATENCY: AgentOp = {
  op: "upsert-kpi",
  kpi: {
    kpiId: "k-latency",
    metric: "checkout p95",
    baseline: "450 ms",
    target: "200 ms",
    direction: "down",
    deadline: "",
    rationale: "",
  },
};

const planOf = (blocks: BlockJson[]) =>
  toPlanDocument(blocks, planMeta("feature"));

const applied = (ops: AgentOp[], blocks = SEEDED) => applyOps(blocks, ops);

const textsOf = (blocks: BlockJson[], slot: string) => {
  const { sections } = planOf(blocks);

  const inSlot = sections.filter((section) => section.slot === slot);

  return writtenBlocks(inSlot.flatMap((section) => section.blocks)).map(
    blockText,
  );
};

describe("applyOps", () => {
  it("writes the agent's paragraphs into the intent section", () => {
    const ops: AgentOp[] = [
      {
        op: "set-section-text",
        slot: "intent",
        paragraphs: ["Checkout is slow.", "Mobile suffers most."],
      },
    ];
    expect(textsOf(applied(ops), "intent")).toEqual([
      "Checkout is slow.",
      "Mobile suffers most.",
    ]);
  });

  it("replaces the section's prose but keeps its plan blocks", () => {
    const withKpi = planWith("feature", {
      kpis: [textBlock("kpi", { kpiId: "k1", metric: "p95" }, "why")],
    });
    const ops: AgentOp[] = [
      { op: "set-section-text", slot: "kpis", paragraphs: ["New wording."] },
    ];
    expect(textsOf(applied(ops, withKpi), "kpis")).toEqual([
      "New wording.",
      "why",
    ]);
  });

  it("appends a paragraph after what the section already holds", () => {
    const first = applied([
      { op: "set-section-text", slot: "intent", paragraphs: ["One."] },
    ]);
    const ops: AgentOp[] = [
      { op: "append-to-section", slot: "intent", paragraphs: ["Two."] },
    ];
    expect(textsOf(applied(ops, first), "intent")).toEqual(["One.", "Two."]);
  });

  it("adds a KPI the plan did not have, in the success criteria section", () => {
    const ops: AgentOp[] = [
      {
        op: "upsert-kpi",
        kpi: {
          kpiId: "k1",
          metric: "checkout p95",
          baseline: "450 ms",
          target: "200 ms",
          direction: "down",
          deadline: "",
          rationale: "conversion",
        },
      },
    ];
    expect(planOf(applied(ops)).kpis).toMatchObject([
      { id: "k1", metric: "checkout p95", target: "200 ms" },
    ]);
  });

  it("updates the KPI in place when the agent sends it again", () => {
    const kpi = {
      kpiId: "k1",
      metric: "checkout p95",
      baseline: "",
      target: "200 ms",
      direction: "down" as const,
      deadline: "",
      rationale: "",
    };
    const twice = applied([
      { op: "upsert-kpi", kpi },
      { op: "upsert-kpi", kpi: { ...kpi, target: "150 ms" } },
    ]);
    expect(planOf(twice).kpis).toMatchObject([{ id: "k1", target: "150 ms" }]);
  });

  it("declares the prototype's maturity", () => {
    const ops: AgentOp[] = [
      {
        op: "set-prototype",
        prototype: {
          maturity: "click-dummy",
          url: "https://figma",
          agreedBy: "ana",
          notes: "",
        },
      },
    ];
    expect(planOf(applied(ops)).prototype).toMatchObject({
      maturity: "click-dummy",
      url: "https://figma",
    });
  });

  it("keeps a rewritten KPI's block id, so nobody's cursor is lost", () => {
    const once = applied([LATENCY]);
    const twice = applyOps(once, [LATENCY]);
    expect(blocksOfType(twice, "kpi").map((block) => block.id)).toEqual(
      blocksOfType(once, "kpi").map((block) => block.id),
    );
  });
});
