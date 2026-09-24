import { describe, it, expect } from "vitest";

import { inlineFromText } from "../blocks/inline-text.js";
import type { AgentOp } from "../ops/agent-ops.js";
import { partitionPass } from "./partition-pass.js";

const NEW_TEXT = {
  type: "paragraph" as const,
  content: inlineFromText("p95 is 450 ms."),
};

describe("partitionPass", () => {
  const ADD_ROLLOUT: AgentOp = {
    op: "add-section",
    slot: "custom-rollout",
    title: "Rollout",
    after: "intent",
    paragraphs: [],
  };

  it("writes a section the pass adds with everything the pass puts in it, and proposes the rest", () => {
    const filling: AgentOp[] = [
      {
        op: "insert-blocks",
        slot: "custom-rollout",
        after: null,
        blocks: [NEW_TEXT],
      },
      {
        op: "add-question",
        slot: "custom-rollout",
        questionId: "q-region",
        question: "Which region first?",
        why: "EU has the most carts.",
        kind: "text",
        options: [],
      },
      {
        op: "set-section-title",
        slot: "custom-rollout",
        title: "Staged rollout",
      },
    ];
    const rewrite: AgentOp = {
      op: "replace-block",
      slot: "intent",
      blockId: "intent-p-1",
      block: NEW_TEXT,
    };

    expect(partitionPass([rewrite, ADD_ROLLOUT, ...filling])).toEqual({
      written: [ADD_ROLLOUT, ...filling],
      proposed: [rewrite],
    });
  });

  it("proposes a whole pass that adds no section", () => {
    const ops: AgentOp[] = [
      { op: "append-to-section", slot: "intent", paragraphs: ["EU only."] },
    ];

    expect(partitionPass(ops)).toEqual({ written: [], proposed: ops });
  });
});
