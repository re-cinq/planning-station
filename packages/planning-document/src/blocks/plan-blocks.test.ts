import { describe, it, expect } from "vitest";

import { planBlockSchema, propZod, isPlanBlockKind } from "./plan-blocks.js";

describe("planBlockSchema", () => {
  it("parses a kpi block and keeps its direction up", () => {
    expect(
      planBlockSchema.parse({
        id: "b1",
        type: "kpi",
        props: {
          kpiId: "k1",
          metric: "checkout conversion",
          baseline: "2.1 %",
          target: "2.6 %",
          direction: "up",
          deadline: "2026-12-31",
        },
        content: [{ type: "text", text: "Why it matters", styles: {} }],
      }),
    ).toMatchObject({
      type: "kpi",
      props: { metric: "checkout conversion", direction: "up" },
      children: [],
    });
  });

  it("rejects a kpi block whose direction is sideways", () => {
    const result = planBlockSchema.safeParse({
      id: "b1",
      type: "kpi",
      props: { direction: "sideways" },
      content: [],
    });
    expect(result.success).toBe(false);
  });

  it("defaults a comment's resolved flag to false", () => {
    expect(
      planBlockSchema.parse({
        id: "b2",
        type: "comment",
        props: { commentId: "c1", author: "Ana" },
        content: [],
      }),
    ).toMatchObject({ props: { author: "Ana", resolved: false } });
  });

  it("rejects content on a section-heading block", () => {
    const result = planBlockSchema.safeParse({
      id: "b3",
      type: "section-heading",
      props: { slot: "kpis", title: "Success criteria" },
      content: [{ type: "text", text: "no", styles: {} }],
    });
    expect(result.success).toBe(false);
  });

  it("defaults a mockup height to 320", () => {
    expect(
      planBlockSchema.parse({
        id: "b4",
        type: "mockup",
        props: { format: "mermaid", markup: "graph TD;" },
        content: [],
      }),
    ).toMatchObject({ props: { format: "mermaid", height: 320 } });
  });
});

describe("propZod", () => {
  const direction = propZod({ default: "up", values: ["up", "down", "hold"] });

  it("builds an enum that accepts down", () => {
    expect(direction.parse("down")).toEqual("down");
  });

  it("builds an enum that refuses left", () => {
    expect(direction.safeParse("left").success).toBe(false);
  });

  it("fills a missing enum value with its default hold", () => {
    expect(
      propZod({ default: "hold", values: ["up", "hold"] }).parse(undefined),
    ).toEqual("hold");
  });

  it("builds a number schema for a numeric default", () => {
    expect(propZod({ default: 320 }).parse(120)).toEqual(120);
  });
});

describe("isPlanBlockKind", () => {
  it("returns true for comment", () => {
    expect(isPlanBlockKind("comment")).toBe(true);
  });

  it("returns false for paragraph", () => {
    expect(isPlanBlockKind("paragraph")).toBe(false);
  });
});
