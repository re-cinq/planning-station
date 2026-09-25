import { describe, it, expect } from "vitest";

import { blockHash } from "../refine/plan-change.js";
import { planWith, textBlock } from "../testing/plans.js";
import { readView } from "./read-view.js";

describe("readView", () => {
  it("lists the seeded paragraph under the intent section", () => {
    const blocks = planWith("feature", {
      intent: [textBlock("paragraph", {}, "Checkout is slow.")],
    });

    const view = readView(blocks);

    expect(view.sections).toHaveLength(8);
    expect(view.sections[0]).toEqual({
      slot: "intent",
      title: "What we want and why",
      blocks: [
        {
          id: "paragraph-Checkout is slow.",
          type: "paragraph",
          hash: blockHash(blocks, "paragraph-Checkout is slow."),
          text: "Checkout is slow.",
        },
      ],
    });
  });
});
