import "@blocknote/ariakit/style.css";
import { describe, it, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import type {
  AgentOp,
  BlockJson,
  PlanDocument,
} from "@re-cinq/planning-document";
import {
  applyOpsToDoc,
  proposeChanges,
  readBlocks,
} from "@re-cinq/planning-yjs";

import { PlanEditor } from "../PlanEditor.js";
import { createMemoryHub, type PlanSeed } from "../session/memory-hub.js";
import { ANA, lastCallOf, planSeed, textBlock } from "../testing/fixtures.js";

const SLOW = "Checkout is slow.";
const CARTS = "Carts are abandoned.";
const FAST = "Checkout p95 is 450 ms.";

const SEED = planSeed("feature", {
  intent: [textBlock("paragraph", {}, SLOW), textBlock("paragraph", {}, CARTS)],
});

const idOf = (hub: ReturnType<typeof createMemoryHub>, text: string) =>
  readBlocks(hub.doc).find((block) =>
    JSON.stringify(block.content).includes(text),
  )?.id ?? "";

const rendered = async (seed = SEED) => {
  const hub = createMemoryHub(seed);
  const onChange = vi.fn<(plan: PlanDocument) => void>();
  const screen = await render(
    <PlanEditor transport={hub.connect()} user={ANA} onChange={onChange} />,
  );
  await expect.element(screen.getByText(SLOW)).toBeVisible();

  return { hub, screen, lastPlan: () => lastCallOf(onChange) };
};

const propose = (hub: ReturnType<typeof createMemoryHub>, op: AgentOp) =>
  proposeChanges(hub.doc, {
    slot: "intent",
    ops: [op],
    uses: { questions: [], comments: [] },
    proposedBy: "planning-agent",
  });

const proposeRewrite = (hub: ReturnType<typeof createMemoryHub>) =>
  propose(hub, {
    op: "replace-block",
    slot: "intent",
    blockId: idOf(hub, SLOW),
    block: {
      type: "paragraph",
      content: [{ type: "text", text: FAST, styles: {} }],
    },
  });

const cardFor = async (op: AgentOp, seed = SEED) => {
  const { hub, screen } = await rendered(seed);
  propose(hub, op);
  const card = screen.getByRole("group", { name: "Proposed change" });
  await expect.element(card).toBeVisible();

  return card.element();
};

const intentText = (plan?: PlanDocument) => {
  const sections = plan?.sections ?? [];
  const intent = sections.find((one) => one.slot === "intent");

  return (intent?.blocks ?? [])
    .filter((block) => block.type === "paragraph")
    .map((block) => JSON.stringify(block.content));
};

describe("a change proposed about one paragraph", () => {
  it("shows the agent's new words under the paragraph they rewrite, and nothing of the old ones", async () => {
    const { hub, screen } = await rendered();
    proposeRewrite(hub);
    const card = screen.getByRole("group", { name: "Proposed change" });
    await expect.element(card).toBeVisible();

    const words = String(card.element().textContent);
    const host = card.element().closest("[data-change-id]");
    const above = host?.previousElementSibling;

    expect({
      shows: words.includes(FAST),
      repeats: words.includes(SLOW),
      under: String(above?.textContent).includes(SLOW),
    }).toEqual({ shows: true, repeats: false, under: true });
  });

  it("draws an added question at the end of its section, reading as the question and taking nothing out", async () => {
    const card = await cardFor({
      op: "add-question",
      slot: "intent",
      questionId: "q-new",
      question: "Which market first?",
      why: "the plan names none",
      kind: "text",
      options: [],
    });

    expect({
      asks: String(card.textContent).includes("Which market first?"),
      struck: struckIn(card),
      removes: /Removes|Clears/.test(String(card.textContent)),
    }).toEqual({ asks: true, struck: [], removes: false });
  });

  it("repeats every line of prose a cleared section loses, struck through under a caption, when set-section-text writes no paragraphs", async () => {
    const card = await cardFor({
      op: "set-section-text",
      slot: "intent",
      paragraphs: [],
    });

    expect(removalIn(card)).toEqual({
      caption: "Clears this section:",
      struck: [SLOW, CARTS],
    });
  });

  it("writes only that paragraph when Accept is clicked", async () => {
    const { hub, screen, lastPlan } = await rendered();
    proposeRewrite(hub);
    await userEvent.click(screen.getByRole("button", { name: "Accept" }));
    await expect.poll(() => intentText(lastPlan()).length).toBe(2);

    expect(JSON.stringify(intentText(lastPlan()))).toContain(FAST);
  });

  it("takes the card away and leaves the paragraph as it was when the change is discarded", async () => {
    const { hub, screen } = await rendered();
    proposeRewrite(hub);
    await expect
      .element(screen.getByRole("group", { name: "Proposed change" }))
      .toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Discard" }));
    await expect
      .poll(() => document.querySelectorAll("[data-change-id]").length)
      .toBe(0);
    await expect.element(screen.getByText(SLOW)).toBeVisible();
  });

  it("repeats the words of the paragraph a removal takes out, struck through under a caption, and nothing of the one it keeps", async () => {
    const card = await cardFor({
      op: "remove-block",
      slot: "intent",
      blockId: `paragraph-${CARTS}`,
    });

    expect({
      ...removalIn(card),
      keeps: String(card.textContent).includes(SLOW),
    }).toEqual({
      caption: "Removes this paragraph:",
      struck: [CARTS],
      keeps: false,
    });
  });

  it.each<{ kind: string; blockId: string; caption: string; struck: string[] }>(
    [
      {
        kind: "table as its cells on one line",
        blockId: "t-markets",
        caption: "Removes this table:",
        struck: ["Market · p95 · DE · 200 ms"],
      },
      {
        kind: "question, though a refine never rewrites one",
        blockId: "question-Which market first?",
        caption: "Removes this question:",
        struck: ["Which market first?"],
      },
      {
        kind: "list item with the items nested under it after its own words",
        blockId: "li-markets",
        caption: "Removes this item:",
        struck: ["Launch in DE", "Then in AT"],
      },
      {
        kind: "item nested under another, where its card hangs",
        blockId: "li-at",
        caption: "Removes this item:",
        struck: ["Then in AT"],
      },
    ],
  )(
    "captions a removed $kind and repeats its words struck through",
    async ({ blockId, caption, struck }) => {
      const card = await cardFor(
        { op: "remove-block", slot: "intent", blockId },
        planSeed("feature", { intent: INTENT_BLOCKS }),
      );

      expect(removalIn(card)).toEqual({ caption, struck });
    },
  );

  it("repeats the paragraph as it reads now, beside Apply anyway, when it was rewritten after the removal was proposed", async () => {
    const { hub, screen } = await rendered();
    propose(hub, {
      op: "remove-block",
      slot: "intent",
      blockId: `paragraph-${CARTS}`,
    });
    applyOpsToDoc(hub.doc, [
      {
        op: "replace-block",
        slot: "intent",
        blockId: `paragraph-${CARTS}`,
        block: {
          type: "paragraph",
          content: [{ type: "text", text: "Carts are left.", styles: {} }],
        },
      },
    ]);
    const card = screen.getByRole("group", { name: "Proposed change" });
    await expect
      .element(card.getByRole("button", { name: "Apply anyway" }))
      .toBeVisible();

    expect(struckIn(card.element())).toEqual(["Carts are left."]);
  });

  it.each<{ says: string; op: AgentOp; seed: PlanSeed }>([
    {
      says: "Removes an empty paragraph.",
      op: { op: "remove-block", slot: "intent", blockId: "paragraph-" },
      seed: planSeed("feature", {
        intent: [
          textBlock("paragraph", {}, SLOW),
          textBlock("paragraph", {}, ""),
        ],
      }),
    },
    {
      says: "Clears an empty section.",
      op: { op: "set-section-text", slot: "intent", paragraphs: [] },
      seed: planSeed("feature", { scope: [textBlock("paragraph", {}, SLOW)] }),
    },
  ])(
    "says $says when what it takes out has no words",
    async ({ says, op, seed }) => {
      const card = await cardFor(op, seed);
      const sentence = [...card.querySelectorAll("p")].find(
        (line) => line.textContent === says,
      );

      expect({
        says: sentence?.textContent,
        struck: struckIn(card),
        decoration: decorationOf(sentence),
      }).toEqual({ says, struck: [], decoration: "none" });
    },
  );

  it("keeps a removed line struck in its card's color under BlockNote's styles for suggestions, even under the pointer", async () => {
    const card = await cardFor({
      op: "remove-block",
      slot: "intent",
      blockId: `paragraph-${CARTS}`,
    });
    const removed = card.querySelector("del")!;
    await userEvent.hover(removed);
    const words = getComputedStyle(removed);
    const line = getComputedStyle(removed.parentElement!);

    expect({
      line: line.textDecorationLine,
      words: words.textDecorationLine,
      color: words.color,
    }).toEqual({ line: "line-through", words: "none", color: line.color });
  });
});

const INTENT_BLOCKS: BlockJson[] = [
  textBlock("paragraph", {}, SLOW),
  {
    id: "t-markets",
    type: "table",
    props: {},
    children: [],
    content: {
      type: "tableContent",
      rows: [{ cells: ["Market", "p95"] }, { cells: ["DE", "200 ms"] }],
    },
  },
  textBlock("question", { questionId: "q-market" }, "Which market first?"),
  {
    id: "li-markets",
    type: "bulletListItem",
    props: {},
    content: [{ type: "text", text: "Launch in DE", styles: {} }],
    children: [
      {
        id: "li-at",
        type: "bulletListItem",
        props: {},
        content: [{ type: "text", text: "Then in AT", styles: {} }],
        children: [],
      },
    ],
  },
];

function decorationOf(element?: Element): string | undefined {
  return element && getComputedStyle(element).textDecorationLine;
}

function removalIn(card: Element) {
  return {
    caption: String(card.querySelector("p")?.textContent),
    struck: struckIn(card),
  };
}

function struckIn(card: Element): string[] {
  return [...card.querySelectorAll("del")].map((line) =>
    String(line.textContent),
  );
}
