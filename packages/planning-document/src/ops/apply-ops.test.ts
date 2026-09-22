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
import { agentOpSchema, type AgentOp } from "./agent-ops.js";
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

  it("updates the KPI people made in the editor, found by its kpiId, keeping its block id", () => {
    const edited = planWith("feature", {
      kpis: [textBlock("kpi", { kpiId: "k-latency", metric: "p95" }, "")],
    });
    expect(
      blocksOfType(applyOps(edited, [LATENCY]), "kpi").map((kpi) => ({
        id: kpi.id,
        target: kpi.props.target,
      })),
    ).toEqual([{ id: "kpi-", target: "200 ms" }]);
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

const ADD_ROLLOUT: AgentOp = {
  op: "add-section",
  slot: "custom-rollout",
  title: "Rollout",
  after: "scope",
  paragraphs: ["Behind a flag."],
};

const slotsOf = (blocks: BlockJson[]) =>
  planOf(blocks).sections.map((section) => section.slot);

describe("applyOps add-section", () => {
  it("places the Rollout section right after scope, with its paragraph", () => {
    const blocks = applied([ADD_ROLLOUT]);
    expect({
      slots: slotsOf(blocks).slice(0, 4),
      texts: textsOf(blocks, "custom-rollout"),
    }).toEqual({
      slots: ["intent", "kpis", "scope", "custom-rollout"],
      texts: ["Behind a flag."],
    });
  });

  it("gives the new section its heading, panel and actions blocks", () => {
    const [rollout] = planOf(applied([ADD_ROLLOUT])).sections.filter(
      (section) => section.slot === "custom-rollout",
    );
    expect({
      headingId: rollout?.headingId,
      title: rollout?.title,
      kinds: rollout?.blocks.map((block) => block.type),
    }).toEqual({
      headingId: "heading-custom-rollout",
      title: "Rollout",
      kinds: ["section-panel", "paragraph", "section-actions"],
    });
  });

  it("leaves the plan alone when the section exists or its anchor does not", () => {
    const once = applied([ADD_ROLLOUT]);
    expect([
      applyOps(once, [ADD_ROLLOUT]),
      applied([{ ...ADD_ROLLOUT, after: "risk" }]),
    ]).toEqual([once, SEEDED]);
  });

  it("refuses a new section whose slot does not start with custom-", () => {
    expect(
      agentOpSchema.safeParse({ ...ADD_ROLLOUT, slot: "rollout" }).success,
    ).toBe(false);
  });
});

describe("applyOps set-section-title", () => {
  it("renames the agent's Rollout section to Staged rollout", () => {
    const renamed = applied([
      ADD_ROLLOUT,
      {
        op: "set-section-title",
        slot: "custom-rollout",
        title: "Staged rollout",
      },
    ]);
    const { sections } = planOf(renamed);
    expect(
      sections.find((section) => section.slot === "custom-rollout")?.title,
    ).toEqual("Staged rollout");
  });

  it("keeps a template section's title, so intent cannot be renamed", () => {
    expect(
      applied([{ op: "set-section-title", slot: "intent", title: "Why" }]),
    ).toEqual(SEEDED);
  });
});

describe("applyOps add-question", () => {
  it("asks q-flag in scope, before the section's actions", () => {
    const blocks = applied([
      {
        op: "add-question",
        slot: "scope",
        questionId: "q-flag",
        question: "Which flag?",
        why: "Rollout needs one",
        kind: "choice",
        options: ["beta", "canary"],
      },
    ]);
    const scope = planOf(blocks).sections.find(
      (section) => section.slot === "scope",
    );
    expect(scope?.blocks.slice(-2)).toMatchObject([
      {
        id: "q-flag",
        type: "question",
        props: {
          questionId: "q-flag",
          why: "Rollout needs one",
          kind: "choice",
          options: '["beta","canary"]',
        },
        content: [{ text: "Which flag?" }],
      },
      { type: "section-actions" },
    ]);
  });
});
