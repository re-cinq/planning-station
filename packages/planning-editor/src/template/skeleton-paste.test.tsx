import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";

import { CHECKOUT_PLAN, FIRST_TITLE } from "../testing/fixtures.js";
import {
  greyedRefineOf,
  intentText,
  pasteInto,
  REFINE_NOTE,
  renderEmpty,
  renderRefinable,
} from "../testing/sections.js";

type RefinableScreen = Awaited<ReturnType<typeof renderRefinable>>["screen"];

const middlePressOn = (target: Element) => {
  target.dispatchEvent(
    new MouseEvent("mousedown", { button: 1, bubbles: true, cancelable: true }),
  );
};

const pastesAfterHeldPress = async (key: string) => {
  const { screen, lastPlan } = await renderEmpty(CHECKOUT_PLAN);
  const checkout = screen.getByText("Checkout").element();
  await userEvent.click(checkout);
  middlePressOn(
    screen.getByRole("heading", { name: "Success criteria" }).element(),
  );
  checkout.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  pasteInto(checkout, "X");

  return lastPlan();
};

const pastesOnMiddleRelease = async (
  pick: (screen: RefinableScreen) => Parameters<typeof userEvent.click>[0],
) => {
  const { screen, lastPlan } = await renderRefinable();
  const checkout = screen.getByText("Checkout").element();
  await userEvent.click(checkout);
  document.addEventListener("pointerup", () => pasteInto(checkout, "X"), {
    once: true,
  });
  await userEvent.click(pick(screen), { button: "middle", force: true });

  return lastPlan();
};

describe("a paste on a section's skeleton", () => {
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

  it("pastes nothing into 'Checkout' when a middle press on the intent's disabled Refine button is released", async () => {
    const plan = await pastesOnMiddleRelease((screen) =>
      greyedRefineOf(screen),
    );
    expect(plan).toBeUndefined();
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
    const plan = await pastesAfterHeldPress("v");
    expect(intentText(plan)).toContain("X");
  });

  it("pastes nothing into 'Checkout' when only Shift is pressed while a middle press on the success criteria heading is held", async () => {
    const plan = await pastesAfterHeldPress("Shift");
    expect(plan).toBeUndefined();
  });

  it("pastes nothing into 'Checkout' from the keyboard after a word of the intent's Refine note is double-clicked", async () => {
    const { screen, lastPlan } = await renderRefinable();
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.dblClick(screen.getByText(REFINE_NOTE).first());
    pasteInto(document.activeElement ?? document.body, "X");
    expect(lastPlan()).toBeUndefined();
  });

  it("pastes nothing into 'Checkout' when a middle press on the intent's Refine note is released", async () => {
    const plan = await pastesOnMiddleRelease((screen) =>
      screen.getByText(REFINE_NOTE).first(),
    );
    expect(plan).toBeUndefined();
  });

  it("leaves a paste into the intent comment box to the box, after a word of the intent's Refine note is double-clicked", async () => {
    const { screen } = await renderRefinable();
    await userEvent.dblClick(screen.getByText(REFINE_NOTE).first());
    const box = screen.getByRole("textbox", {
      name: `Comment on ${FIRST_TITLE}`,
    });
    const paste = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
    });
    box.element().dispatchEvent(paste);
    expect(paste.defaultPrevented).toBe(false);
  });
});
