import { describe, it, expect } from "vitest";

import { planWith, textBlock } from "../testing/plans.js";
import {
  markUsed,
  refineInputs,
  settledCount,
  usesOf,
} from "./refine-inputs.js";

const TARGET = textBlock(
  "question",
  { questionId: "q-target" },
  "Which number do we stop at?",
);
const ROLLOUT = textBlock(
  "question",
  { questionId: "q-rollout" },
  "Who tells support?",
);
const ANSWER = textBlock("answer", { questionId: "q-target" }, "300 ms");
const CACHE = textBlock(
  "comment",
  { commentId: "c1", author: "Ben", resolved: true },
  "Cache quotes?",
);
const REPLY = textBlock(
  "comment",
  { commentId: "c2", replyTo: "c1", author: "Ana" },
  "Under a minute.",
);
const OPEN = textBlock(
  "comment",
  { commentId: "c3", author: "Cleo" },
  "What about vouchers?",
);

const PLAN = planWith("feature", {
  kpis: [TARGET, ANSWER, ROLLOUT, CACHE, REPLY, OPEN],
});

describe("refineInputs", () => {
  it("settles q-target with its answer 300 ms and the resolved thread c1 with its reply", () => {
    expect(refineInputs(PLAN, "kpis")).toMatchObject({
      answered: [
        {
          questionId: "q-target",
          question: "Which number do we stop at?",
          answer: "300 ms",
        },
      ],
      resolved: [
        {
          commentId: "c1",
          said: [
            { author: "Ben", text: "Cache quotes?" },
            { author: "Ana", text: "Under a minute." },
          ],
        },
      ],
    });
  });

  it("keeps the unanswered q-rollout and Cleo's unresolved thread as open talk", () => {
    expect(refineInputs(PLAN, "kpis")).toMatchObject({
      openQuestions: [
        { questionId: "q-rollout", question: "Who tells support?" },
      ],
      openThreads: [{ commentId: "c3" }],
    });
  });

  it("counts 2 settled inputs and reports q-target and c1 as the ones a proposal uses", () => {
    const inputs = refineInputs(PLAN, "kpis");
    expect({ settled: settledCount(inputs), uses: usesOf(inputs) }).toEqual({
      settled: 2,
      uses: { questions: ["q-target"], comments: ["c1"] },
    });
  });

  it("settles nothing once an earlier refine used q-target and c1", () => {
    const used = markUsed(PLAN, { questions: ["q-target"], comments: ["c1"] });
    expect(settledCount(refineInputs(used, "kpis"))).toBe(0);
  });
});

describe("markUsed", () => {
  it("marks q-target and c1 used and leaves q-rollout and Cleo's comment alone", () => {
    const used = markUsed(PLAN, { questions: ["q-target"], comments: ["c1"] })
      .filter((block) => block.type === "question" || block.type === "comment")
      .filter((block) => block.props.used)
      .map((block) => block.id);
    expect(used).toEqual([CACHE.id, TARGET.id]);
  });
});
