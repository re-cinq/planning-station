import "@blocknote/ariakit/style.css";
import "./styles/theme.scss";

import { afterEach, beforeAll, describe, it, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { enforceTrue } from "@re-cinq/planning-document/lib/enforce.js";

import type { PlanDocument } from "@re-cinq/planning-document";
import { blockText, writtenBlocks } from "@re-cinq/planning-document/testing";

import {
  CHECKOUT_PLAN,
  FIRST_TITLE,
  planSeed,
  renderAsAna,
  textBlock,
} from "./testing/fixtures.js";
import { EMPTY_SECTION_TEXT } from "./template/empty-section.js";

const WIDE = { width: 1280, height: 900 };
const PADDING_INSET = 4;
const HOST_BAR_HEIGHT = 64;
const EMPTY_PLAN = planSeed("performance");
const BLANK_INTENT = planSeed("performance", {
  intent: [textBlock("paragraph", {}, "")],
});
const COMMENTED_INTENT = planSeed("performance", {
  intent: [
    textBlock("paragraph", {}, "Checkout"),
    textBlock(
      "comment",
      { commentId: "c1", author: "Ben", at: "2026-09-18T09:12:00.000Z" },
      "Support tags this weekly.",
    ),
  ],
});
const REFINE_NOTE =
  "Nothing for the agent to refine yet. Answer a question in this section or resolve a comment, and Refine appears here.";

const writtenIn = (plan: PlanDocument | undefined) =>
  (plan?.sections ?? []).flatMap(({ blocks }) => writtenBlocks(blocks)).length;

const editorOf = (container: HTMLElement): HTMLElement => {
  const editor = container.querySelector(".bn-editor");
  enforceTrue(
    editor instanceof HTMLElement,
    Error,
    "the plan editor did not render",
  );

  return editor;
};

const boxOf = (element: Element) => element.getBoundingClientRect();

const paddingsOf = (element: HTMLElement) => {
  const { paddingLeft, paddingRight } = getComputedStyle(element);

  return { left: paddingLeft, right: paddingRight };
};

const overlapVertically = (first: DOMRect, second: DOMRect) =>
  first.top < second.bottom && second.top < first.bottom;

const inPaddingBeside = (editor: HTMLElement, element: Element) => {
  const { top, height } = boxOf(element);

  return new DOMPoint(
    PADDING_INSET,
    Math.round(top + height / 2 - boxOf(editor).top),
  ).toJSON() as { x: number; y: number };
};

const inGapBetween = (editor: HTMLElement, above: Element, below: Element) => {
  const editorBox = boxOf(editor);

  return new DOMPoint(
    Math.round(boxOf(above).right - editorBox.left),
    Math.round((boxOf(above).bottom + boxOf(below).top) / 2 - editorBox.top),
  ).toJSON() as { x: number; y: number };
};

const NOTHING_TAKEN = { focused: false, selectedBlocks: 0, written: 0 };

const renderEmpty = async (seed = EMPTY_PLAN) => {
  const rendered = await renderAsAna(seed, { showOutline: false });
  await expect
    .element(rendered.screen.getByRole("heading", { name: FIRST_TITLE }))
    .toBeVisible();

  return rendered;
};

type Screen = Awaited<ReturnType<typeof renderEmpty>>["screen"];

type Button = "left" | "right" | "middle";

const pressPaddingBeside = async (
  pick: (screen: Screen) => { element: () => Element },
  button: Button = "left",
) => {
  const { screen, lastPlan } = await renderEmpty();
  const editor = editorOf(screen.container);
  await userEvent.click(editor, {
    button,
    position: inPaddingBeside(editor, pick(screen).element()),
  });
  await userEvent.keyboard("{Enter}");

  return {
    focused: editor.contains(document.activeElement),
    selectedBlocks: editor.querySelectorAll(".ProseMirror-selectednode").length,
    written: writtenIn(lastPlan()),
  };
};

const kpisOf = (plan: PlanDocument | undefined) => {
  const [, kpis] = plan?.sections ?? [];

  return writtenBlocks(kpis?.blocks).map(blockText);
};

describe("the plan's layout, themed, on a wide page", () => {
  beforeAll(async () => {
    await page.viewport(WIDE.width, WIDE.height);
  });

  afterEach(() => {
    document.body.style.removeProperty("--ps-sticky-top");
  });

  it("puts the Comment button on the same row as the intent heading", async () => {
    const { screen } = await renderEmpty();
    const comment = screen.getByRole("button", {
      name: `Comment on ${FIRST_TITLE}`,
    });
    const heading = screen.getByRole("heading", { name: FIRST_TITLE });
    expect(
      overlapVertically(boxOf(comment.element()), boxOf(heading.element())),
    ).toBe(true);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding beside the intent actions is pressed", async () => {
    const pressed = await pressPaddingBeside((screen) =>
      screen.getByRole("group", { name: `${FIRST_TITLE} actions` }),
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding beside the intent actions is right-clicked", async () => {
    const pressed = await pressPaddingBeside(
      (screen) => screen.getByRole("group", { name: `${FIRST_TITLE} actions` }),
      "right",
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding beside the intent actions is middle-clicked", async () => {
    const pressed = await pressPaddingBeside(
      (screen) => screen.getByRole("group", { name: `${FIRST_TITLE} actions` }),
      "middle",
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding beside the intent heading is pressed", async () => {
    const pressed = await pressPaddingBeside((screen) =>
      screen.getByRole("heading", { name: FIRST_TITLE }),
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("gives the plan the same padding on both sides when it holds no comment", async () => {
    const { screen } = await renderEmpty();
    const { left, right } = paddingsOf(editorOf(screen.container));
    expect(right).toBe(left);
  });

  it("gives the plan the same padding on both sides when it holds a comment", async () => {
    const { screen } = await renderEmpty(COMMENTED_INTENT);
    const { left, right } = paddingsOf(editorOf(screen.container));
    expect(right).toBe(left);
  });

  it("draws Ben's comment under the intent's 'Checkout'", async () => {
    const { screen } = await renderEmpty(COMMENTED_INTENT);
    const checkout = screen.getByText("Checkout");
    const comment = screen.getByLabelText("Comment by Ben");
    expect(boxOf(comment.element()).top).toBeGreaterThanOrEqual(
      boxOf(checkout.element()).bottom,
    );
  });

  it("draws the plan without a shadow", async () => {
    const { screen } = await renderEmpty();
    expect(getComputedStyle(editorOf(screen.container)).boxShadow).toBe("none");
  });

  it("takes nothing when the space between 'Targets' and the success criteria's actions, which is the actions' own, is pressed", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    const editor = editorOf(screen.container);
    const targets = screen.getByText("Targets").element();
    const actions = screen.getByRole("group", {
      name: "Success criteria actions",
    });
    await userEvent.click(editor, {
      position: inGapBetween(editor, targets, actions.element()),
    });
    await userEvent.keyboard("X");
    expect({
      focused: editor.contains(document.activeElement),
      kpis: kpisOf(lastPlan()),
    }).toEqual({ focused: false, kpis: [] });
  });

  it("changes nothing when Z is typed after the caret in 'Checkout' is left for a press in the padding beside the success criteria actions", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    const editor = editorOf(screen.container);
    await userEvent.click(screen.getByText("Checkout"));
    const actions = screen.getByRole("group", {
      name: "Success criteria actions",
    });
    await userEvent.click(editor, {
      position: inPaddingBeside(editor, actions.element()),
    });
    await userEvent.keyboard("Z");
    expect(lastPlan()).toBeUndefined();
  });

  it("puts the caret at the start of 'Targets' when the padding beside it is pressed", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    const editor = editorOf(screen.container);
    await userEvent.click(editor, {
      position: inPaddingBeside(editor, screen.getByText("Targets").element()),
    });
    await userEvent.keyboard("X");
    expect(kpisOf(lastPlan())).toEqual(["XTargets"]);
  });

  it("selects a word of the intent's Refine note when it is double-clicked, so it can be copied", async () => {
    const { screen } = await renderAsAna(EMPTY_PLAN, {
      showOutline: false,
      onRefine: () => Promise.resolve(),
    });
    await userEvent.dblClick(screen.getByText(REFINE_NOTE).first());
    expect(window.getSelection()?.toString().trim()).not.toBe("");
  });

  it("starts the outline below a host bar 64px tall", async () => {
    document.body.style.setProperty("--ps-sticky-top", "64px");
    const { screen } = await renderEmpty();
    const sidebar = screen.container.querySelector("aside");
    const layoutGap = parseFloat(
      getComputedStyle(screen.container.firstElementChild!).rowGap,
    );

    expect(parseFloat(getComputedStyle(sidebar!).top)).toBe(
      HOST_BAR_HEIGHT + layoutGap,
    );
  });

  it("shows 'Write here…' on an empty intent paragraph", async () => {
    const { screen } = await renderEmpty(BLANK_INTENT);
    const marked = screen.container.querySelector("[data-plan-placeholder]");
    expect(marked && getComputedStyle(marked, "::after").content).toBe(
      `"${EMPTY_SECTION_TEXT}"`,
    );
  });
});
