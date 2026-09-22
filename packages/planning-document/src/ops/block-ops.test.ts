import { describe, it, expect } from "vitest";

import type { BlockJson } from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";
import { blockText, planWith, textBlock } from "../testing/plans.js";
import { applyOps } from "./apply-ops.js";

describe("applyOps block by block", () => {
  const para = (text: string) => ({
    type: "paragraph" as const,
    content: inlineFromText(text),
  });

  const plan = () =>
    planWith("feature", {
      intent: [
        textBlock("paragraph", {}, "Checkout is slow."),
        textBlock("paragraph", {}, "Carts are abandoned."),
      ],
    });

  const idOf = (blocks: BlockJson[], text: string) =>
    blocks.find((block) => blockText(block) === text)?.id ?? "";

  const intentText = (blocks: BlockJson[]) =>
    blocks
      .filter((block) => block.type === "paragraph")
      .map(blockText)
      .filter((text) => text !== "");

  it("replaces one paragraph by its id and leaves the paragraph beside it alone", () => {
    const blocks = plan();
    const after = applyOps(blocks, [
      {
        op: "replace-block",
        slot: "intent",
        blockId: idOf(blocks, "Checkout is slow."),
        block: para("Checkout p95 is 450 ms."),
      },
    ]);

    expect(intentText(after)).toEqual([
      "Checkout p95 is 450 ms.",
      "Carts are abandoned.",
    ]);
  });

  it("keeps the replaced paragraph's id, so a person writing in it keeps their place", () => {
    const blocks = plan();
    const id = idOf(blocks, "Checkout is slow.");
    const after = applyOps(blocks, [
      {
        op: "replace-block",
        slot: "intent",
        blockId: id,
        block: para("Checkout p95 is 450 ms."),
      },
    ]);

    expect(idOf(after, "Checkout p95 is 450 ms.")).toEqual(id);
  });

  it("inserts new paragraphs after the paragraph they follow", () => {
    const blocks = plan();
    const after = applyOps(blocks, [
      {
        op: "insert-blocks",
        slot: "intent",
        after: idOf(blocks, "Checkout is slow."),
        blocks: [para("Payment is the drop-off.")],
      },
    ]);

    expect(intentText(after)).toEqual([
      "Checkout is slow.",
      "Payment is the drop-off.",
      "Carts are abandoned.",
    ]);
  });

  it("inserts at the top of the section when it follows nothing", () => {
    const after = applyOps(plan(), [
      {
        op: "insert-blocks",
        slot: "intent",
        after: null,
        blocks: [para("First, the numbers.")],
      },
    ]);

    expect(intentText(after)[0]).toEqual("First, the numbers.");
  });

  it("removes the paragraph an edit deleted", () => {
    const blocks = plan();
    const after = applyOps(blocks, [
      {
        op: "remove-block",
        slot: "intent",
        blockId: idOf(blocks, "Carts are abandoned."),
      },
    ]);

    expect(intentText(after)).toEqual(["Checkout is slow."]);
  });

  it("changes nothing when the block it names is gone, so a change someone already deleted under is not re-applied", () => {
    const after = applyOps(plan(), [
      {
        op: "replace-block",
        slot: "intent",
        blockId: "gone",
        block: para("Nowhere."),
      },
      { op: "remove-block", slot: "intent", blockId: "gone" },
    ]);

    expect(intentText(after)).toEqual([
      "Checkout is slow.",
      "Carts are abandoned.",
    ]);
  });
});
