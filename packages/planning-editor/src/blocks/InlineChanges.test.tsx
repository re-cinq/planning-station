import { describe, it, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import type { AgentOp, PlanDocument } from "@re-cinq/planning-document";
import { proposeChanges, readBlocks } from "@re-cinq/planning-yjs";

import { PlanEditor } from "../PlanEditor.js";
import { createMemoryHub } from "../session/memory-hub.js";
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

const rendered = async () => {
  const hub = createMemoryHub(SEED);
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

const cardWordsFor = async (op: AgentOp) => {
  const { hub, screen } = await rendered();
  propose(hub, op);
  const card = screen.getByRole("group", { name: "Proposed change" });
  await expect.element(card).toBeVisible();

  return String(card.element().textContent);
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

  it("draws an added question at the end of its section, reading as the question rather than a paragraph that goes", async () => {
    const words = await cardWordsFor({
      op: "add-question",
      slot: "intent",
      questionId: "q-new",
      question: "Which market first?",
      why: "the plan names none",
      kind: "text",
      options: [],
    });

    expect({
      asks: words.includes("Which market first?"),
      drops: words.includes("This paragraph goes."),
    }).toEqual({ asks: true, drops: false });
  });

  it("does not claim a paragraph goes when set-section-text writes no paragraphs", async () => {
    const words = await cardWordsFor({
      op: "set-section-text",
      slot: "intent",
      paragraphs: [],
    });

    expect(words.includes("This paragraph goes.")).toBe(false);
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
});
