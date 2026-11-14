import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import { BlockNoteEditor } from "@blocknote/core";
import type { Node as PmNode } from "prosemirror-model";
import { NodeSelection } from "prosemirror-state";
import {
  inlineFromText,
  parseBlock,
  type BlockJson,
  type PlanDocument,
} from "@re-cinq/planning-document";
import { blockText, writtenBlocks } from "@re-cinq/planning-document/testing";

import {
  CHECKOUT_PLAN,
  planMeta,
  planSeed,
  renderAsAna,
  textBlock,
} from "../testing/fixtures.js";
import { toEditorBlocks } from "../schema/block-bridge.js";
import { planSchema } from "../schema/plan-schema.js";
import { isTopLevel } from "./section-moves.js";

const MOVE_DOWN = "{ControlOrMeta>}{Shift>}{ArrowDown}{/Shift}{/ControlOrMeta}";
const MOVE_UP = "{ControlOrMeta>}{Shift>}{ArrowUp}{/Shift}{/ControlOrMeta}";

const LAST_WRITTEN = planSeed("performance", {
  questions: [textBlock("paragraph", {}, "Who signs off?")],
});
const COMMENTED_INTENT = planSeed("performance", {
  intent: [
    textBlock("paragraph", {}, "Checkout"),
    textBlock("comment", { commentId: "c1", author: "Ben" }, "Is it?"),
    textBlock("comment", { commentId: "c2", author: "Ana" }, "Yes."),
  ],
});
const NESTED_INTENT = planSeed("performance", {
  intent: [
    parseBlock({
      id: "bullet-fast",
      type: "bulletListItem",
      content: inlineFromText("Fast"),
      children: [textBlock("bulletListItem", {}, "Faster")],
    }),
  ],
});
const TWO_INTENT_PARAGRAPHS = planSeed("performance", {
  intent: [
    textBlock("paragraph", {}, "Checkout"),
    textBlock("paragraph", {}, "Payment"),
  ],
  kpis: [textBlock("paragraph", {}, "Targets")],
});
const INTENT_WITHOUT_ACTIONS = {
  meta: planMeta("performance"),
  blocks: CHECKOUT_PLAN.blocks.filter((block) => block.id !== "actions-intent"),
};

const orderOf = (blocks: readonly BlockJson[]) => {
  const written = writtenBlocks(blocks);

  return blocks.map((block) =>
    written.includes(block) ? blockText(block) : block.type,
  );
};

const sectionNamed = (plan: PlanDocument | undefined, slot: string) => {
  const section = plan?.sections.find((candidate) => candidate.slot === slot);

  return orderOf(section?.blocks ?? []);
};

const nestedEditor = () => {
  const editor = BlockNoteEditor.create({
    schema: planSchema,
    initialContent: toEditorBlocks(NESTED_INTENT.blocks),
  });
  editor.mount(document.body.appendChild(document.createElement("div")));

  return editor;
};

const containerPos = (doc: PmNode, id: string) => {
  const found: number[] = [];
  doc.descendants((node, pos) => {
    if (node.type.name === "blockContainer" && node.attrs["id"] === id) {
      found.push(pos);
    }

    return found.length === 0;
  });

  return found[0] ?? -1;
};

const selectsAtTopLevel = (id: string, offset: number) => {
  const { doc } = nestedEditor().prosemirrorState;

  return isTopLevel(NodeSelection.create(doc, containerPos(doc, id) + offset));
};

const startIn = async (text: string, seed = CHECKOUT_PLAN) => {
  const rendered = await renderAsAna(seed);
  await userEvent.click(rendered.screen.getByText(text));
  await userEvent.keyboard("{End}");

  return rendered;
};

describe("sectionMoves", () => {
  it("moves the intent's 'Checkout' down over its actions to the top of the success criteria's writing", async () => {
    const { lastPlan } = await startIn("Checkout");
    await userEvent.keyboard(MOVE_DOWN);
    expect([
      sectionNamed(lastPlan(), "intent"),
      sectionNamed(lastPlan(), "kpis"),
    ]).toEqual([
      ["section-panel", "section-actions"],
      ["Checkout", "Targets", "section-panel", "section-actions"],
    ]);
  });

  it("keeps the cursor in 'Checkout' after the move, so typing goes on where it was", async () => {
    const { lastPlan } = await startIn("Checkout");
    await userEvent.keyboard(MOVE_DOWN);
    await userEvent.keyboard("!");
    expect(sectionNamed(lastPlan(), "kpis")).toEqual([
      "Checkout!",
      "Targets",
      "section-panel",
      "section-actions",
    ]);
  });

  it("moves the success criteria's 'Targets' up over the intent's panel and actions in one press, under 'Checkout'", async () => {
    const { lastPlan } = await startIn("Targets");
    await userEvent.keyboard(MOVE_UP);
    expect(sectionNamed(lastPlan(), "intent")).toEqual([
      "Checkout",
      "Targets",
      "section-panel",
      "section-actions",
    ]);
  });

  it("moves 'Checkout' down over the two comments under the intent in one press", async () => {
    const { lastPlan } = await startIn("Checkout", COMMENTED_INTENT);
    await userEvent.keyboard(MOVE_DOWN);
    expect(sectionNamed(lastPlan(), "kpis")).toEqual([
      "Checkout",
      "section-panel",
      "section-actions",
    ]);
  });

  it("moves 'Targets' up to the end of an intent that has no actions", async () => {
    const { lastPlan } = await startIn("Targets", INTENT_WITHOUT_ACTIONS);
    await userEvent.keyboard(MOVE_UP);
    expect(sectionNamed(lastPlan(), "intent")).toEqual([
      "Checkout",
      "Targets",
      "section-panel",
    ]);
  });

  it("leaves 'Checkout' first in the intent when it is moved up out of the first section", async () => {
    const { lastPlan } = await startIn("Checkout");
    await userEvent.keyboard(MOVE_UP);
    await userEvent.keyboard("!");
    expect(sectionNamed(lastPlan(), "intent")).toEqual([
      "Checkout!",
      "section-panel",
      "section-actions",
    ]);
  });

  it("leaves 'Who signs off?' above the last section's panel and actions when it is moved down", async () => {
    const { lastPlan } = await startIn("Who signs off?", LAST_WRITTEN);
    await userEvent.keyboard(MOVE_DOWN);
    await userEvent.keyboard("!");
    expect(sectionNamed(lastPlan(), "questions")).toEqual([
      "Who signs off?!",
      "section-panel",
      "section-actions",
    ]);
  });

  it("leaves the nested 'Faster' in the intent, as BlockNote moves it, rather than carrying its parent 'Fast' away", async () => {
    const { lastPlan } = await startIn("Faster", NESTED_INTENT);
    await userEvent.keyboard(MOVE_DOWN);
    expect(sectionNamed(lastPlan(), "intent")).toEqual([
      "Fast",
      "Faster",
      "section-panel",
      "section-actions",
    ]);
  });

  it("keeps 'Checkout' and 'Payment', selected together, in the intent when they are moved down at its edge", async () => {
    const { screen, lastPlan } = await startIn(
      "Payment",
      TWO_INTENT_PARAGRAPHS,
    );
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    await userEvent.keyboard(MOVE_DOWN);
    await userEvent.click(screen.getByText("Targets"));
    await userEvent.keyboard("{End}!");
    expect([
      sectionNamed(lastPlan(), "intent"),
      sectionNamed(lastPlan(), "kpis"),
    ]).toEqual([
      ["section-panel", "Checkout", "Payment", "section-actions"],
      ["Targets!", "section-panel", "section-actions"],
    ]);
  });

  it("takes the selected 'Fast' as a top-level block to carry across sections", () => {
    expect(selectsAtTopLevel("bullet-fast", 1)).toBe(true);
  });

  it("leaves the selected nested 'Faster' to BlockNote's one step, since its block is not top-level", () => {
    expect(selectsAtTopLevel("bulletListItem-Faster", 0)).toBe(false);
  });
});
