import "@blocknote/ariakit/style.css";
import "./styles/theme.scss";

import { beforeAll, describe, it, expect } from "vitest";
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
const writeInIntent = { name: `${EMPTY_SECTION_TEXT} in ${FIRST_TITLE}` };
const EMPTY_PLAN = planSeed("performance");
const BLANK_INTENT = planSeed("performance", {
  intent: [textBlock("paragraph", {}, "")],
});
const REFINE_NOTE = "Answer a question or resolve a thread to refine";

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

const pressPaddingBeside = async (
  pick: (screen: Screen) => { element: () => Element },
) => {
  const { screen, lastPlan } = await renderEmpty();
  const editor = editorOf(screen.container);
  await userEvent.click(editor, {
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

  it("puts the intent comment box on the same row as the intent placeholder", async () => {
    const { screen } = await renderEmpty();
    const comment = screen.getByRole("textbox", {
      name: `Comment on ${FIRST_TITLE}`,
    });
    const placeholder = screen.getByRole("button", writeInIntent);
    expect(
      overlapVertically(boxOf(comment.element()), boxOf(placeholder.element())),
    ).toBe(true);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding beside the intent actions is pressed", async () => {
    const pressed = await pressPaddingBeside((screen) =>
      screen.getByRole("group", { name: `${FIRST_TITLE} actions` }),
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding beside the intent heading is pressed", async () => {
    const pressed = await pressPaddingBeside((screen) =>
      screen.getByRole("heading", { name: FIRST_TITLE }),
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("neither focuses the editor, selects a block nor takes an Enter when the padding level with the intent comment box is pressed", async () => {
    const pressed = await pressPaddingBeside((screen) =>
      screen.getByRole("textbox", { name: `Comment on ${FIRST_TITLE}` }),
    );
    expect(pressed).toEqual(NOTHING_TAKEN);
  });

  it("puts the intent comment box on the same row as an empty intent paragraph", async () => {
    const { screen } = await renderEmpty(BLANK_INTENT);
    const comment = screen.getByRole("textbox", {
      name: `Comment on ${FIRST_TITLE}`,
    });
    const marked = screen.container.querySelector("[data-plan-placeholder]");
    expect(
      marked !== null &&
        overlapVertically(boxOf(comment.element()), boxOf(marked)),
    ).toBe(true);
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

  it("shows 'Write here…' on an empty intent paragraph", async () => {
    const { screen } = await renderEmpty(BLANK_INTENT);
    const marked = screen.container.querySelector("[data-plan-placeholder]");
    expect(marked && getComputedStyle(marked, "::after").content).toBe(
      `"${EMPTY_SECTION_TEXT}"`,
    );
  });
});
