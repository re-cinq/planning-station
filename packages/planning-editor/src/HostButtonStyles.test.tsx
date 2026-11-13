import "./styles/theme.scss";

import { afterEach, describe, it, expect } from "vitest";
import { page, userEvent, type Locator } from "vitest/browser";
import { render } from "vitest-browser-react";
import { askRefine, failRefine } from "@re-cinq/planning-yjs";

import { PlanEditor } from "./PlanEditor.js";
import { createMemoryHub } from "./session/memory-hub.js";
import {
  ANA,
  CHECKOUT_PLAN,
  FIRST_TITLE,
  planSeed,
  renderAsAna,
  renderPair,
  textBlock,
} from "./testing/fixtures.js";

const HOST_REST = "rgb(4, 5, 6)";
const HOST_HOVER = "rgb(1, 2, 3)";
const HOST_STYLES = `button { background: ${HOST_REST}; color: ${HOST_REST} } button:hover { background: ${HOST_HOVER}; color: ${HOST_HOVER} }`;

const THREADED = planSeed("feature", {
  intent: [
    textBlock("paragraph", {}, "Checkout"),
    textBlock(
      "comment",
      { commentId: "c1", author: "Ben", at: "2026-09-18T09:12:00.000Z" },
      "Support tags this weekly.",
    ),
  ],
});

const hostStyle = document.createElement("style");

const colouredByHost = async (button: Locator) => {
  await expect.element(button).toBeVisible();
  await userEvent.hover(button);
  const { backgroundColor, color } = getComputedStyle(button.element());

  return [backgroundColor, color].some(
    (colour) => colour === HOST_HOVER || colour === HOST_REST,
  );
};

const renderRemovable = async () => {
  const { screen } = await renderAsAna(planSeed("feature"));

  return screen.getByRole("button", { name: "Remove section Prototype" });
};

const renderFailedRefine = async () => {
  const hub = createMemoryHub(CHECKOUT_PLAN);
  const screen = await render(
    <PlanEditor
      transport={hub.connect()}
      user={ANA}
      onRefine={() => Promise.resolve()}
    />,
  );
  await expect
    .element(screen.getByRole("heading", { name: FIRST_TITLE }))
    .toBeVisible();
  askRefine(hub.doc, { slot: "kpis", askedBy: "Ana" });
  failRefine(hub.doc, { slot: "kpis", reason: "the agent crashed" });

  return screen.getByRole("button", { name: "Dismiss" });
};

const renderThread = async () => {
  const { screen } = await renderAsAna(THREADED);

  return screen
    .getByLabelText("Comment by Ben")
    .getByRole("button", { name: "Resolve" });
};

const renderParticipant = async () => {
  const { ana, ben } = await renderPair(CHECKOUT_PLAN);
  await userEvent.click(ana.getByText("Checkout"));

  return ben.getByRole("button", { name: /^Ana in/ });
};

const renderRemoveDialog = async () => {
  const button = await renderRemovable();
  await userEvent.click(button);

  return page.getByRole("dialog").getByRole("button", { name: "Remove" });
};

const hoveredUnderHostStyles = async (renderButton: () => Promise<Locator>) => {
  hostStyle.textContent = HOST_STYLES;
  document.head.append(hostStyle);

  return colouredByHost(await renderButton());
};

describe("a host's button styles", () => {
  afterEach(() => {
    hostStyle.remove();
  });

  it("keeps a host's button hover colour off the Remove section button", async () => {
    expect(await hoveredUnderHostStyles(renderRemovable)).toBe(false);
  });

  it("keeps a host's button hover colour off the Dismiss button", async () => {
    expect(await hoveredUnderHostStyles(renderFailedRefine)).toBe(false);
  });

  it("keeps a host's button hover colour off the Resolve button", async () => {
    expect(await hoveredUnderHostStyles(renderThread)).toBe(false);
  });

  it("keeps a host's button hover colour off a participant's name", async () => {
    expect(await hoveredUnderHostStyles(renderParticipant)).toBe(false);
  });

  it("keeps a host's button hover colour off the Remove button of the removal dialog", async () => {
    expect(await hoveredUnderHostStyles(renderRemoveDialog)).toBe(false);
  });

  it("keeps a host's button hover colour off the Generate prototype button", async () => {
    expect(await hoveredUnderHostStyles(renderGenerate)).toBe(false);
  });
});

async function renderGenerate() {
  const { screen } = await renderAsAna(planSeed("feature"), {
    onGeneratePrototype: () => Promise.resolve(),
  });

  return screen.getByRole("button", { name: "Generate prototype" });
}
