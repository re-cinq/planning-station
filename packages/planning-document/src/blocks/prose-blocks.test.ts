import { describe, it, expect } from "vitest";

import { proseBlockSchema, isProseBlockKind } from "./prose-blocks.js";

describe("proseBlockSchema", () => {
  it("parses a paragraph and defaults props and children", () => {
    expect(
      proseBlockSchema.parse({
        id: "p1",
        type: "paragraph",
        content: [
          { type: "text", text: "Two paragraphs a director reads", styles: {} },
        ],
      }),
    ).toEqual({
      id: "p1",
      type: "paragraph",
      props: {},
      content: [
        { type: "text", text: "Two paragraphs a director reads", styles: {} },
      ],
      children: [],
    });
  });

  it("parses a bullet item nesting another bullet item", () => {
    const parsed = proseBlockSchema.parse({
      id: "l1",
      type: "bulletListItem",
      content: [],
      children: [{ id: "l2", type: "bulletListItem", content: [] }],
    });
    expect(parsed.children).toMatchObject([
      { id: "l2", type: "bulletListItem" },
    ]);
  });

  it("accepts a level 2 heading", () => {
    expect(
      proseBlockSchema.safeParse({
        id: "h",
        type: "heading",
        props: { level: 2 },
      }).success,
    ).toBe(true);
  });

  it("rejects a level 1 heading reserved for the plan title", () => {
    expect(
      proseBlockSchema.safeParse({
        id: "h",
        type: "heading",
        props: { level: 1 },
      }).success,
    ).toBe(false);
  });

  it("rejects a level 4 heading the editor cannot produce", () => {
    expect(
      proseBlockSchema.safeParse({
        id: "h",
        type: "heading",
        props: { level: 4 },
      }).success,
    ).toBe(false);
  });

  it("rejects an image block", () => {
    expect(proseBlockSchema.safeParse({ id: "i", type: "image" }).success).toBe(
      false,
    );
  });

  it("parses a table whose content is tableContent", () => {
    expect(
      proseBlockSchema.parse({
        id: "t",
        type: "table",
        content: { type: "tableContent", rows: [] },
      }).content,
    ).toEqual({ type: "tableContent", rows: [] });
  });
});

describe("isProseBlockKind", () => {
  it("returns true for checkListItem", () => {
    expect(isProseBlockKind("checkListItem")).toBe(true);
  });

  it("returns false for kpi", () => {
    expect(isProseBlockKind("kpi")).toBe(false);
  });
});
