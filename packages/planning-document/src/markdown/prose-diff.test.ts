import { describe, it, expect } from "vitest";

import type { ProseBlock } from "../blocks/prose-blocks.js";
import { inlineFromText } from "../blocks/inline-text.js";
import { proseDiffOps } from "./prose-diff.js";

const live = (id: string, text: string): ProseBlock => ({
  id,
  type: "paragraph",
  props: {},
  content: inlineFromText(text),
  children: [],
});

const written = (text: string) => ({
  type: "paragraph" as const,
  content: inlineFromText(text),
});

const SLOW = live("p1", "Checkout is slow.");
const CARTS = live("p2", "Carts are abandoned.");

describe("proseDiffOps", () => {
  it("writes no op for prose the file wrote back as it was", () => {
    expect(
      proseDiffOps(
        "intent",
        [SLOW, CARTS],
        [written("Checkout is slow."), written("Carts are abandoned.")],
      ),
    ).toEqual([]);
  });

  it("replaces the one paragraph the file rewrote, by its id, and leaves its neighbour out of the ops", () => {
    expect(
      proseDiffOps(
        "intent",
        [SLOW, CARTS],
        [written("Checkout p95 is 450 ms."), written("Carts are abandoned.")],
      ),
    ).toEqual([
      {
        op: "replace-block",
        slot: "intent",
        blockId: "p1",
        block: written("Checkout p95 is 450 ms."),
      },
    ]);
  });

  it("inserts the paragraphs the file added as one insert, after the paragraph they follow", () => {
    expect(
      proseDiffOps(
        "intent",
        [SLOW, CARTS],
        [
          written("Checkout is slow."),
          written("Payment is the drop-off."),
          written("It is the last step."),
          written("Carts are abandoned."),
        ],
      ),
    ).toEqual([
      {
        op: "insert-blocks",
        slot: "intent",
        after: "p1",
        blocks: [
          written("Payment is the drop-off."),
          written("It is the last step."),
        ],
      },
    ]);
  });

  it("inserts at the top of the section what the file wrote before every paragraph it kept", () => {
    expect(
      proseDiffOps(
        "intent",
        [SLOW],
        [written("First, the numbers."), written("Checkout is slow.")],
      ),
    ).toMatchObject([{ op: "insert-blocks", after: null }]);
  });

  it("removes the paragraph the file dropped, naming the one it dropped", () => {
    expect(
      proseDiffOps("intent", [SLOW, CARTS], [written("Checkout is slow.")]),
    ).toEqual([{ op: "remove-block", slot: "intent", blockId: "p2" }]);
  });

  it("turns two paragraphs into the one the file kept: one is rewritten in place, the other removed", () => {
    const ops = proseDiffOps(
      "intent",
      [SLOW, CARTS],
      [written("Checkout p95 is 450 ms.")],
    );

    expect({
      kinds: ops.map((op) => op.op).sort(),
      ids: ops.map((op) => ("blockId" in op ? op.blockId : "")).sort(),
    }).toEqual({
      kinds: ["remove-block", "replace-block"],
      ids: ["p1", "p2"],
    });
  });
});
