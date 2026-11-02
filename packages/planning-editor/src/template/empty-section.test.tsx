import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import { templateFor, type PlanDocument } from "@re-cinq/planning-document";
import { blockText, writtenBlocks } from "@re-cinq/planning-document/testing";

import {
  CHECKOUT_PLAN,
  FIRST_TITLE,
  planMeta,
  planSeed,
  renderAsAna,
  seeded,
  textBlock,
} from "../testing/fixtures.js";
import { EMPTY_SECTION_TEXT } from "./empty-section.js";

const EMPTY_PLAN = planSeed("performance");
const BLANK_INTENT = planSeed("performance", {
  intent: [textBlock("paragraph", {}, "")],
});
const BLANK_UNDER_INTENT_ACTIONS = {
  meta: planMeta("performance"),
  blocks: seeded("performance").flatMap((block) =>
    block.id === "actions-intent"
      ? [block, textBlock("paragraph", {}, "")]
      : [block],
  ),
};
const QUESTION_ONLY_INTENT = planSeed("performance", {
  intent: [textBlock("question", { questionId: "q1" }, "Which pages?")],
});
const { slots: PERFORMANCE_SLOTS } = templateFor("performance");
const writeInIntent = { name: `${EMPTY_SECTION_TEXT} in ${FIRST_TITLE}` };

const placeholderCount = (container: HTMLElement) =>
  container.querySelectorAll(`[aria-label^="${EMPTY_SECTION_TEXT} in "]`)
    .length;

const renderEmpty = async (seed = EMPTY_PLAN) => {
  const rendered = await renderAsAna(seed);
  await expect
    .element(rendered.screen.getByRole("heading", { name: FIRST_TITLE }))
    .toBeVisible();

  return rendered;
};

const REFINE_NOTE = "Answer a question or resolve a thread to refine";

const renderRefinable = async () => {
  const rendered = await renderAsAna(CHECKOUT_PLAN, {
    onRefine: () => Promise.resolve(),
  });
  const { screen } = rendered;
  await expect.element(screen.getByText(REFINE_NOTE).first()).toBeVisible();

  return rendered;
};

const pasteInto = (target: Element, text: string) => {
  const clipboardData = new DataTransfer();
  clipboardData.setData("text/plain", text);
  target.dispatchEvent(
    new ClipboardEvent("paste", { clipboardData, bubbles: true }),
  );
};

const TOUCH = { pointerId: 7, pointerType: "touch", bubbles: true };

const touchesThen = (target: Element, last: "pointerup" | "pointercancel") => {
  target.dispatchEvent(new PointerEvent("pointerdown", TOUCH));
  target.dispatchEvent(new PointerEvent(last, TOUCH));
};

const middlePressOn = (target: Element) => {
  target.dispatchEvent(
    new MouseEvent("mousedown", { button: 1, bubbles: true, cancelable: true }),
  );
};

const greyedRefineOf = (
  screen: Awaited<ReturnType<typeof renderAsAna>>["screen"],
) => screen.getByRole("button", { name: "Refine this section" }).first();

const renderReadOnly = async () => {
  const rendered = await renderAsAna(EMPTY_PLAN, { readOnly: true });
  await expect
    .element(rendered.screen.getByRole("heading", { name: FIRST_TITLE }))
    .toBeVisible();

  return rendered.screen;
};

const intentOf = (plan: PlanDocument | undefined) => {
  const [intent] = plan?.sections ?? [];
  const blocks = intent?.blocks ?? [];

  return {
    written: writtenBlocks(blocks),
    last: blocks.at(-1)?.type,
  };
};

const intentText = (plan: PlanDocument | undefined) => {
  const { written } = intentOf(plan);

  return written.map(blockText).join();
};

describe("emptySectionPlaceholder", () => {
  it("offers a placeholder in every section of an empty performance plan", async () => {
    const { screen } = await renderEmpty();
    await expect
      .poll(() => placeholderCount(screen.container))
      .toBe(PERFORMANCE_SLOTS.length);
  });

  it("reads 'Write here…' in the intent placeholder", async () => {
    const { screen } = await renderEmpty();
    await expect
      .element(screen.getByRole("button", writeInIntent))
      .toHaveTextContent(EMPTY_SECTION_TEXT);
  });

  it("writes 'Faster' in a new intent paragraph, before its actions, once its placeholder is clicked", async () => {
    const { screen, lastPlan } = await renderEmpty();
    await userEvent.click(screen.getByRole("button", writeInIntent));
    await userEvent.keyboard("Faster");
    expect(intentOf(lastPlan())).toMatchObject({
      written: [{ type: "paragraph", content: [{ text: "Faster" }] }],
      last: "section-actions",
    });
  });

  it("takes the intent placeholder away once its section holds 'Faster'", async () => {
    const { screen } = await renderEmpty();
    await userEvent.click(screen.getByRole("button", writeInIntent));
    await userEvent.keyboard("Faster");
    await expect
      .poll(() => placeholderCount(screen.container))
      .toBe(PERFORMANCE_SLOTS.length - 1);
  });

  it("marks an empty intent paragraph with the placeholder instead of adding a second place to write", async () => {
    const { screen } = await renderEmpty(BLANK_INTENT);
    const marked = screen.container.querySelector("[data-plan-placeholder]");
    expect({
      marked: marked?.getAttribute("data-plan-placeholder"),
      widgets: placeholderCount(screen.container),
    }).toEqual({
      marked: EMPTY_SECTION_TEXT,
      widgets: PERFORMANCE_SLOTS.length - 1,
    });
  });

  it("writes 'Hi' in the empty intent paragraph it marked", async () => {
    const { screen, lastPlan } = await renderEmpty(BLANK_INTENT);
    const marked = screen.container.querySelector("[data-plan-placeholder]");
    await userEvent.click(marked ?? document.body);
    await userEvent.keyboard("Hi");
    expect(intentOf(lastPlan()).written).toMatchObject([
      { content: [{ text: "Hi" }] },
    ]);
  });

  it("draws no placeholder in a read-only plan", async () => {
    const screen = await renderReadOnly();
    expect(placeholderCount(screen.container)).toBe(0);
  });

  it("writes nothing when Enter follows a click on the intent heading", async () => {
    const { screen, lastPlan } = await renderEmpty();
    await userEvent.click(screen.getByRole("heading", { name: FIRST_TITLE }));
    await userEvent.keyboard("{Enter}");
    expect(intentOf(lastPlan()).written).toEqual([]);
  });

  it("leaves the plan title 'Faster checkout' alone when X is typed after a click on the success criteria heading", async () => {
    const { screen, lastPlan } = await renderEmpty();
    await userEvent.click(
      screen.getByRole("heading", { name: "Success criteria" }),
    );
    await userEvent.keyboard("X");
    expect(lastPlan()?.title ?? "Faster checkout").toBe("Faster checkout");
  });

  it("changes nothing when Z is typed after the caret in 'Checkout' is left for a click on the success criteria heading", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.click(
      screen.getByRole("heading", { name: "Success criteria" }),
    );
    await userEvent.keyboard("Z");
    expect(lastPlan()).toBeUndefined();
  });

  it("changes nothing when Z is typed after the caret in 'Checkout' is left for a right-click on the success criteria heading", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.click(
      screen.getByRole("heading", { name: "Success criteria" }),
      { button: "right" },
    );
    await userEvent.keyboard("Z");
    expect(lastPlan()).toBeUndefined();
  });

  it("changes nothing when Z is typed after the caret in 'Checkout' is left for a click on the intent's disabled Refine button", async () => {
    const { screen, lastPlan } = await renderRefinable();
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.click(
      screen.getByRole("button", { name: "Refine this section" }).first(),
      { force: true },
    );
    await userEvent.keyboard("Z");
    expect(lastPlan()).toBeUndefined();
  });

  it("pastes nothing into 'Checkout' when a middle press on the success criteria heading is released", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    const checkout = screen.getByText("Checkout").element();
    await userEvent.click(checkout);
    document.addEventListener("mouseup", () => pasteInto(checkout, "X"), {
      once: true,
    });
    await userEvent.click(
      screen.getByRole("heading", { name: "Success criteria" }),
      { button: "middle" },
    );
    expect(lastPlan()).toBeUndefined();
  });

  it("lets Z be written in 'Checkout' after a touch on the intent's disabled Refine button turned into a scroll", async () => {
    const { screen, lastPlan } = await renderRefinable();
    touchesThen(greyedRefineOf(screen).element(), "pointercancel");
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.keyboard("Z");
    expect(intentText(lastPlan())).toContain("Z");
  });

  it("keeps the editor unfocused when a tap on the intent's disabled Refine button focuses it after the caret was in 'Checkout'", async () => {
    const { screen } = await renderRefinable();
    const checkout = screen.getByText("Checkout").element();
    await userEvent.click(checkout);
    touchesThen(greyedRefineOf(screen).element(), "pointerup");
    checkout.closest<HTMLElement>("[contenteditable='true']")?.focus();
    expect(checkout.closest("[contenteditable='true']")).not.toBe(
      document.activeElement,
    );
  });

  it("pastes nothing into 'Checkout' when a middle press on the intent's disabled Refine button is released", async () => {
    const { screen, lastPlan } = await renderRefinable();
    const checkout = screen.getByText("Checkout").element();
    await userEvent.click(checkout);
    document.addEventListener("pointerup", () => pasteInto(checkout, "X"), {
      once: true,
    });
    await userEvent.click(greyedRefineOf(screen), {
      button: "middle",
      force: true,
    });
    expect(lastPlan()).toBeUndefined();
  });

  it("leaves a paste into a box beside the plan alone while a middle press on the success criteria heading is held", async () => {
    const { screen } = await renderEmpty(CHECKOUT_PLAN);
    const box = document.body.appendChild(document.createElement("textarea"));
    middlePressOn(
      screen.getByRole("heading", { name: "Success criteria" }).element(),
    );
    const paste = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
    });
    box.dispatchEvent(paste);
    box.remove();
    expect(paste.defaultPrevented).toBe(false);
  });

  it("pastes 'X' into 'Checkout' from the keyboard after a middle press on the success criteria heading whose release was lost", async () => {
    const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
    const checkout = screen.getByText("Checkout").element();
    await userEvent.click(checkout);
    middlePressOn(
      screen.getByRole("heading", { name: "Success criteria" }).element(),
    );
    checkout.dispatchEvent(
      new KeyboardEvent("keydown", { key: "v", bubbles: true }),
    );
    pasteInto(checkout, "X");
    expect(intentText(lastPlan())).toContain("X");
  });

  it("writes nothing when the intent placeholder is right-clicked", async () => {
    const { screen, lastPlan } = await renderEmpty();
    await userEvent.click(screen.getByRole("button", writeInIntent), {
      button: "right",
    });
    expect(lastPlan()).toBeUndefined();
  });

  it("changes nothing when Enter follows a click on the intent's Refine note, after the caret was in 'Checkout'", async () => {
    const { screen, lastPlan } = await renderRefinable();
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.click(screen.getByText(REFINE_NOTE).first());
    await userEvent.keyboard("{Enter}");
    expect(lastPlan()).toBeUndefined();
  });

  it("changes nothing when Enter, Backspace, Delete and X follow a double-click on a word of the intent's Refine note, after the caret was in 'Checkout'", async () => {
    const { screen, lastPlan } = await renderRefinable();
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.dblClick(screen.getByText(REFINE_NOTE).first());
    await userEvent.keyboard("{Enter}{Backspace}{Delete}X");
    expect(lastPlan()).toBeUndefined();
  });

  it("offers the intent placeholder above its actions, not on an empty paragraph left under them", async () => {
    const { screen } = await renderEmpty(BLANK_UNDER_INTENT_ACTIONS);
    await expect
      .element(screen.getByRole("button", writeInIntent))
      .toBeVisible();
    expect(
      screen.container.querySelectorAll("[data-plan-placeholder]"),
    ).toHaveLength(0);
  });

  it("writes 'Faster' above the intent's only question, 'Which pages?'", async () => {
    const { screen, lastPlan } = await renderEmpty(QUESTION_ONLY_INTENT);
    await userEvent.click(screen.getByRole("button", writeInIntent));
    await userEvent.keyboard("Faster");
    expect(intentOf(lastPlan()).written.map(blockText)).toEqual([
      "Faster",
      "Which pages?",
    ]);
  });
});
