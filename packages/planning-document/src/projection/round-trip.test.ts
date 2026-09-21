import { describe, it, expect } from "vitest";

import type { PlanMeta } from "../plan/plan-meta.js";
import { planDocumentSchema } from "../plan/plan-document.js";
import { templateFor } from "../template/templates.js";
import { block, heading, paragraph } from "../testing/block-builders.js";
import { actionsBlock, panelBlock, seedBlocks, titleBlock } from "./seed.js";
import { toBlocks } from "./to-blocks.js";
import { toPlanDocument } from "./to-plan-document.js";

const META: PlanMeta = {
  schemaVersion: 1,
  id: "8e3c1f0a-0000-4000-8000-000000000001",
  repo: "acme/shop",
  type: "feature",
  templateVersion: 1,
  title: "Faster checkout",
  status: "draft",
  approval: null,
  version: 4,
  createdBy: "octocat",
  updatedAt: "2026-09-19T10:00:00.000Z",
};

const FEATURE_BLOCKS = [
  titleBlock("Faster checkout"),
  heading("intent", "What we want and why"),
  paragraph("Checkout takes too long on mobile.", "p1"),
  heading("kpis", "Success criteria"),
  block(
    "kpi",
    { kpiId: "k1", metric: "p95", target: "200 ms", direction: "down" },
    { id: "k1" },
  ),
  heading("prototype", "Prototype"),
  block("prototype", { maturity: "click-dummy" }, { id: "proto" }),
];

describe("toPlanDocument", () => {
  it("projects the feature fixture into sections and derived views", () => {
    expect(toPlanDocument(FEATURE_BLOCKS, META)).toMatchObject({
      title: "Faster checkout",
      sections: [{ slot: "intent" }, { slot: "kpis" }, { slot: "prototype" }],
      kpis: [{ id: "k1", metric: "p95", direction: "down" }],
      prototype: { maturity: "click-dummy" },
    });
  });

  it("produces a value planDocumentSchema accepts", () => {
    expect(
      planDocumentSchema.safeParse(toPlanDocument(FEATURE_BLOCKS, META))
        .success,
    ).toBe(true);
  });
});

describe("round trip", () => {
  it("toBlocks(toPlanDocument(blocks)) equals the feature fixture blocks", () => {
    expect(toBlocks(toPlanDocument(FEATURE_BLOCKS, META))).toEqual(
      FEATURE_BLOCKS,
    );
  });

  it("toPlanDocument(toBlocks(plan)) equals the plan", () => {
    const plan = toPlanDocument(FEATURE_BLOCKS, META);
    expect(toPlanDocument(toBlocks(plan), META)).toEqual(plan);
  });
});

describe("seedBlocks", () => {
  it("seeds a heading, panel and actions per ui-change slot, in template order", () => {
    const seeded = seedBlocks(templateFor("ui-change"), {
      idFor: (slot) => `h-${slot}`,
    });
    expect(
      toPlanDocument(seeded, { ...META, type: "ui-change" }).sections,
    ).toEqual(
      templateFor("ui-change").slots.map((slot) => ({
        headingId: `h-${slot.slot}`,
        slot: slot.slot,
        title: slot.title,
        blocks: [panelBlock(slot.slot), actionsBlock(slot.slot)],
      })),
    );
  });

  it("opens the plan with its feature name as the title block", () => {
    const seeded = seedBlocks(templateFor("feature"), {
      title: "Faster checkout",
    });
    expect(toPlanDocument(seeded, META).title).toEqual("Faster checkout");
  });

  it("gives every seeded heading a sec_ prefixed id by default", () => {
    const headings = seedBlocks(templateFor("refactor")).filter(
      (seeded) => seeded.type === "section-heading",
    );
    expect(headings.every((heading) => heading.id.startsWith("sec_"))).toBe(
      true,
    );
  });
});
