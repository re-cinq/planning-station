import { describe, it, expect } from "vitest";

import { planWith } from "../testing/plans.js";
import { changesFor, changeWords } from "./plan-change.js";

const SKETCH_RUN = changesFor(planWith("feature", {}), {
  slot: "prototype",
  ops: [
    {
      op: "add-mockup",
      mockup: {
        mockupId: "m-flow-1",
        kind: "flow",
        format: "mermaid",
        caption: "Run of the loop",
        markup: "flowchart LR\n  a --> b",
        height: 320,
      },
    },
  ],
  uses: { questions: [], comments: [] },
  proposedBy: "plan-sketch",
});

describe("changeWords for a sketch", () => {
  it('reads an added sketch as "Sketch (flow): Run of the loop"', () => {
    expect(
      SKETCH_RUN.map((change) => ({
        slot: change.slot,
        anchorId: change.anchorId,
        words: changeWords(change),
      })),
    ).toEqual([
      {
        slot: "prototype",
        anchorId: null,
        words: ["Sketch (flow): Run of the loop"],
      },
    ]);
  });
});
