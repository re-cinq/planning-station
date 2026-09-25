import { describe, it, expect } from "vitest";
import { userEvent, type Locator } from "vitest/browser";

import { PALETTE } from "./presence/palette.js";
import {
  CHECKOUT_PLAN as SEED,
  FIRST_TITLE,
  planSeed,
  renderAsAna,
  renderPair,
  textBlock,
} from "./testing/fixtures.js";

const LONG_SEED = planSeed("performance", {
  intent: [
    ...[...Array(60).keys()].map((line) =>
      textBlock("paragraph", {}, `Line ${line}`),
    ),
    textBlock("paragraph", {}, "Last line"),
  ],
});

const cursorIn = (region: Element) =>
  region.querySelector(".bn-collaboration-cursor__caret");

const blockOf = (element: Element | null) =>
  element?.closest(".bn-block-content")?.textContent ?? "";

const isOnScreen = (element: Element | null) => {
  const rect = element?.getBoundingClientRect();

  return Boolean(rect && rect.top >= 0 && rect.bottom <= window.innerHeight);
};

const dotColor = (region: Element, name: string) =>
  [...region.querySelectorAll('[aria-label="Participants"] li')]
    .find((entry) => entry.textContent.startsWith(name))
    ?.querySelector("circle")
    ?.getAttribute("fill");

const selectionIn = (region: Element) =>
  region.querySelector<HTMLElement>(".ProseMirror-yjs-selection");

const selectCheckout = async (ana: Locator) => {
  await userEvent.click(ana.getByText("Checkout"));
  await expect
    .poll(() => ana.element().contains(document.activeElement))
    .toBeTruthy();
  await userEvent.keyboard("{End}{Shift>}{Home}{/Shift}");
  await expect.poll(() => String(document.getSelection())).toBe("Checkout");
};

const channelsOf = (hex: string) =>
  [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16))
    .join(", ");

describe("presence", () => {
  it("lists Ana in Ben's participants with the section she is editing", async () => {
    const { ana, ben } = await renderPair(SEED);
    await userEvent.click(ana.getByText("Checkout"));
    await expect.element(ben.getByText(`Ana in ${FIRST_TITLE}`)).toBeVisible();
  });

  it("renders no participants list when Ana is alone on the plan", async () => {
    const { screen } = await renderAsAna(SEED);
    await expect
      .element(screen.getByRole("heading", { name: FIRST_TITLE }))
      .toBeVisible();
    expect(
      screen.getByRole("list", { name: "Participants" }).elements(),
    ).toEqual([]);
  });

  it("lists Ana as plain text until she places her cursor, then as a button", async () => {
    const { ana, ben } = await renderPair(SEED);
    const participants = ben.getByRole("list", { name: "Participants" });
    await expect.element(participants.getByText("Ana")).toBeVisible();
    expect(participants.getByRole("button").elements()).toEqual([]);
    await userEvent.click(ana.getByText("Checkout"));
    await expect
      .element(participants.getByRole("button", { name: /^Ana in/ }))
      .toBeVisible();
  });

  it("scrolls Ben's view to Ana's cursor when he clicks her name, keeping focus where it was", async () => {
    const { ana, ben } = await renderPair(LONG_SEED);
    await userEvent.click(ana.getByText("Last line"));
    const cursor = () => cursorIn(ben.element());
    await expect.poll(() => blockOf(cursor())).toContain("Last line");
    const offScreenBefore = !isOnScreen(cursor());
    const focused = document.activeElement;
    await userEvent.click(ben.getByRole("button", { name: /^Ana in/ }));
    await expect.poll(() => isOnScreen(cursor())).toBeTruthy();
    expect({
      offScreenBefore,
      focusKept: document.activeElement === focused,
    }).toEqual({ offScreenBefore: true, focusKept: true });
  });

  it("draws Ana's cursor labelled with her name in Ben's editor", async () => {
    const { ana, ben } = await renderPair(SEED);
    await userEvent.click(ana.getByText("Checkout"));
    await userEvent.keyboard("{End}!");
    await expect
      .element(ben.getByText("Ana", { exact: true }))
      .toBeInTheDocument();
  });

  it("gives Ana the first palette color and Ben the second, the same on both screens", async () => {
    const { ana, ben } = await renderPair(SEED);
    await expect
      .poll(() => ({
        anaSeenByBen: dotColor(ben.element(), "Ana"),
        benSeenByAna: dotColor(ana.element(), "Ben"),
      }))
      .toEqual({ anaSeenByBen: PALETTE[0], benSeenByAna: PALETTE[1] });
  });

  it("draws Ana's caret in Ben's editor in the color her name carries in his list", async () => {
    const { ana, ben } = await renderPair(SEED);
    await userEvent.click(ana.getByText("Checkout"));
    const caret = () => cursorIn(ben.element());
    await expect.poll(caret).toBeTruthy();
    expect(getComputedStyle(caret()!).backgroundColor).toBe(
      `rgb(${channelsOf(PALETTE[0]!)})`,
    );
  });

  it("highlights the word Ana selects in Ben's editor, in her color", async () => {
    const { ana, ben } = await renderPair(SEED);
    await selectCheckout(ana);
    await expect
      .poll(() => selectionIn(ben.element())?.textContent)
      .toBe("Checkout");
    expect(selectionIn(ben.element())?.style.backgroundColor).toMatch(
      `rgba(${channelsOf(PALETTE[0]!)}, 0.4`,
    );
  });

  it("keeps Ana's selection highlighted in Ben's editor after she clicks away", async () => {
    const { ana, ben } = await renderPair(SEED);
    await selectCheckout(ana);
    await expect.poll(() => selectionIn(ben.element())).toBeTruthy();
    await userEvent.click(ben.getByText("Targets"));
    await new Promise((settle) => setTimeout(settle, 100));
    expect(selectionIn(ben.element())?.textContent).toBe("Checkout");
  });

  it("clears Ana's selection from Ben's editor when she leaves the plan", async () => {
    const { ana, ben, anaLeaves } = await renderPair(SEED);
    await selectCheckout(ana);
    await expect.poll(() => selectionIn(ben.element())).toBeTruthy();
    await anaLeaves();
    await expect.poll(() => selectionIn(ben.element())).toBeNull();
  });
});
