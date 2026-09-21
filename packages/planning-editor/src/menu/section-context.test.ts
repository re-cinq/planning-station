import { describe, it, expect } from "vitest";

import { questionAt, slotAt, type MenuBlock } from "./section-context.js";

const menuBlock = (
  id: string,
  type: string,
  props: Record<string, unknown> = {},
): MenuBlock => ({ id, type, props, children: [] });

const NESTED_LIST: MenuBlock = {
  ...menuBlock("list", "bulletListItem"),
  children: [menuBlock("nested", "paragraph")],
};

const PLAN = [
  menuBlock("h-kpis", "section-heading", { slot: "kpis" }),
  menuBlock("q-9", "question", { questionId: "q-target" }),
  menuBlock("h-questions", "section-heading", { slot: "questions" }),
  menuBlock("q-1", "question", { questionId: "q-staleness" }),
  menuBlock("p-1", "paragraph"),
  menuBlock("q-2", "question", { questionId: "q-rollout" }),
  NESTED_LIST,
];

describe("slotAt", () => {
  it("returns questions for a block under the questions heading", () => {
    expect(slotAt(PLAN, "p-1")).toEqual("questions");
  });

  it("returns questions for a list item nested inside the questions section", () => {
    expect(slotAt(PLAN, "nested")).toEqual("questions");
  });

  it("returns null for an id that is not in the document", () => {
    expect(slotAt(PLAN, "missing")).toBeNull();
  });
});

describe("questionAt", () => {
  it("returns q-rollout for a block after the second question", () => {
    expect(questionAt(PLAN, "nested")).toEqual("q-rollout");
  });

  it("returns null right after the questions heading, ignoring q-target in kpis", () => {
    expect(questionAt(PLAN, "h-questions")).toBeNull();
  });
});
