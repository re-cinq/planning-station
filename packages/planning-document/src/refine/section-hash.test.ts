import { describe, it, expect } from "vitest";

import { planWith, textBlock } from "../testing/plans.js";
import { sectionHash } from "./section-hash.js";

const SLOW = textBlock("paragraph", {}, "Checkout is slow.");

const intentOf = (...blocks: ReturnType<typeof textBlock>[]) =>
  sectionHash(planWith("feature", { intent: blocks }), "intent");

describe("sectionHash", () => {
  it("keeps the intent's hash when a comment is added to it", () => {
    const comment = textBlock(
      "comment",
      { commentId: "c1", author: "Ben" },
      "Is it?",
    );
    expect(intentOf(SLOW, comment)).toBe(intentOf(SLOW));
  });

  it("keeps the intent's hash when a question in it is answered", () => {
    const question = textBlock("question", { questionId: "q1" }, "Mobile?");
    const answer = textBlock("answer", { questionId: "q1" }, "Yes");
    expect(intentOf(SLOW, question, answer)).toBe(intentOf(SLOW, question));
  });

  it("changes the intent's hash when its paragraph is rewritten", () => {
    const rewritten = textBlock("paragraph", {}, "Checkout is very slow.");
    expect(intentOf(rewritten)).not.toBe(intentOf(SLOW));
  });

  it("hashes the intent as at most 14 hex digits", () => {
    expect(intentOf(SLOW)).toMatch(/^[0-9a-f]{1,14}$/);
  });
});
