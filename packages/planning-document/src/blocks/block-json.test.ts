import { describe, it, expect } from "vitest";

import {
  blockJsonSchema,
  parseBlock,
  isPlanBlock,
  blocksOfType,
} from "./block-json.js";

describe("blocksOfType", () => {
  it("keeps the two kpi blocks out of a kpi, paragraph, kpi list", () => {
    const blocks = [
      parseBlock({ id: "k1", type: "kpi", props: { metric: "p95" } }),
      parseBlock({ id: "p", type: "paragraph" }),
      parseBlock({ id: "k2", type: "kpi", props: { metric: "cost" } }),
    ];
    expect(blocksOfType(blocks, "kpi").map((kpi) => kpi.props.metric)).toEqual([
      "p95",
      "cost",
    ]);
  });
});

describe("parseBlock", () => {
  it("parses an answer block with its defaults", () => {
    expect(
      parseBlock({
        id: "a",
        type: "answer",
        props: { questionId: "q1" },
        content: [],
      }),
    ).toEqual({
      id: "a",
      type: "answer",
      props: { questionId: "q1" },
      content: [],
      children: [],
    });
  });

  it("parses a quote as a prose block", () => {
    expect(parseBlock({ id: "q", type: "quote", content: [] })).toMatchObject({
      type: "quote",
      props: {},
    });
  });

  it("throws for a video block", () => {
    expect(() => parseBlock({ id: "v", type: "video" })).toThrow();
  });
});

describe("blockJsonSchema", () => {
  it("accepts a question block", () => {
    expect(
      blockJsonSchema.safeParse({
        id: "q",
        type: "question",
        props: { questionId: "q1", kind: "choice", options: "yes, no" },
        content: [],
        children: [],
      }).success,
    ).toBe(true);
  });

  it("rejects null", () => {
    expect(blockJsonSchema.safeParse(null).success).toBe(false);
  });
});

describe("isPlanBlock", () => {
  it("returns true for a kpi block and false for a paragraph", () => {
    const kpi = parseBlock({ id: "k", type: "kpi", props: {}, content: [] });
    const paragraph = parseBlock({ id: "p", type: "paragraph", content: [] });
    expect([kpi, paragraph].map(isPlanBlock)).toEqual([true, false]);
  });
});
