import { describe, it, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  applyOps,
  templateFor,
  type ValidationReport,
} from "@re-cinq/planning-document";
import { writtenBlocks } from "@re-cinq/planning-document/testing";

import { PlanEditor, type PlanEditorProps } from "./PlanEditor.js";
import { createMemoryHub } from "./session/memory-hub.js";
import {
  ANA,
  BEN,
  editingAna,
  lastCallOf,
  planSeed,
  textBlock,
} from "./testing/fixtures.js";

const SEED = planSeed("performance", {
  intent: [textBlock("paragraph", {}, "Checkout")],
  kpis: [textBlock("paragraph", {}, "Targets")],
});
const FIRST_TITLE = "What we want and why";

const firstHeading = { name: FIRST_TITLE };

const WITH_ROLLOUT = {
  ...SEED,
  blocks: applyOps(SEED.blocks, [
    {
      op: "add-section",
      slot: "custom-rollout",
      title: "Rollout",
      after: "kpis",
      paragraphs: ["Behind a flag."],
    },
  ]),
};

const renderRollout = async () => {
  const { props } = editingAna(WITH_ROLLOUT);
  const screen = await render(<PlanEditor {...props} />);
  await expect
    .element(screen.getByRole("heading", { name: "Rollout" }))
    .toBeVisible();

  return screen;
};

const dragHandles = () => document.querySelectorAll('[data-test="dragHandle"]');

const renderPlan = async (extra: Partial<PlanEditorProps> = {}) => {
  const { props, lastPlan } = editingAna(SEED);
  const screen = await render(<PlanEditor {...props} {...extra} />);
  await expect.element(screen.getByRole("heading", firstHeading)).toBeVisible();

  return { screen, lastPlan };
};

const renderPair = async () => {
  const hub = createMemoryHub(SEED);
  const screen = await render(
    <>
      <section aria-label="Ana's editor">
        <PlanEditor transport={hub.connect()} user={ANA} showOutline={false} />
      </section>
      <section aria-label="Ben's editor">
        <PlanEditor transport={hub.connect()} user={BEN} showOutline={false} />
      </section>
    </>,
  );
  const ana = screen.getByRole("region", { name: "Ana's editor" });
  const ben = screen.getByRole("region", { name: "Ben's editor" });
  await expect.element(ben.getByRole("heading", firstHeading)).toBeVisible();

  return { ana, ben };
};

const headingTitles = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-slot] h2")].map(
    (title) => title.textContent,
  );

describe("PlanEditor", () => {
  it("renders every performance section title in template order", async () => {
    const { screen } = await renderPlan();
    expect(headingTitles(screen.container)).toEqual(
      templateFor("performance").slots.map((slot) => slot.title),
    );
  });

  it("shows the numeric-KPI hint under the performance success criteria", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByText(/Baseline and target are mandatory numbers/))
      .toBeVisible();
  });

  it("emits a plan whose intent reads 'Checkout under 200 ms' after typing", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.click(screen.getByText("Checkout"));
    await userEvent.keyboard("{End} under 200 ms");
    const [intent] = lastPlan()?.sections ?? [];
    expect(writtenBlocks(intent?.blocks)).toMatchObject([
      { content: [{ text: "Checkout under 200 ms" }] },
    ]);
  });

  it("renders a read-only editor that is not content-editable", async () => {
    const { screen } = await renderPlan({ readOnly: true });
    expect(
      screen.container.querySelector("[contenteditable='true']"),
    ).toBeNull();
  });

  it("inserts a KPI under Success criteria when '/KPI' is chosen", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.click(screen.getByText("Targets"));
    await userEvent.keyboard("{End}{Enter}/KPI");
    await userEvent.click(screen.getByRole("option", { name: /KPI/ }));
    expect(lastPlan()?.kpis).toHaveLength(1);
  });

  it("renders the agent's Rollout section under its title, with the agent's hint", async () => {
    const screen = await renderRollout();
    await expect
      .element(screen.getByText("Added by the planning agent for this plan."))
      .toBeVisible();
  });

  it("lists the agent's Rollout section in the outline after Success criteria", async () => {
    const screen = await renderRollout();
    const outline = screen.getByRole("navigation", { name: "Plan outline" });
    const titles = [...outline.element().querySelectorAll("ol > li")].map(
      (entry) => entry.getAttribute("aria-label"),
    );
    expect(titles.slice(1, 3)).toEqual(["Success criteria", "Rollout"]);
  });

  it("offers Question in the agent's Rollout section when '/' is typed", async () => {
    const screen = await renderRollout();
    await userEvent.click(screen.getByText("Behind a flag."));
    await userEvent.keyboard("{End}{Enter}/Question");
    await expect
      .element(screen.getByRole("option", { name: /Question/ }))
      .toBeVisible();
  });

  it("gives a paragraph a drag handle and the Rollout heading none", async () => {
    const screen = await renderRollout();
    await userEvent.hover(screen.getByText("Behind a flag."));
    await expect.poll(() => dragHandles().length).toBe(1);
    await userEvent.hover(screen.getByRole("heading", { name: "Rollout" }));
    await expect.poll(() => dragHandles().length).toBe(0);
  });

  it("draws the 'Approve plan' footer inside the plan outline", async () => {
    const { screen } = await renderPlan({
      outlineFooter: <button type="button">Approve plan</button>,
    });
    await expect
      .element(
        screen
          .getByRole("navigation", { name: "Plan outline" })
          .getByRole("button", { name: "Approve plan" }),
      )
      .toBeVisible();
  });

  it("reports the missing KPI to onValidation at approval", async () => {
    const onValidation = vi.fn<(report: ValidationReport) => void>();
    await renderPlan({ onValidation });
    expect(lastCallOf(onValidation)).toMatchObject({
      passed: false,
      phase: "approval",
      problems: expect.arrayContaining([
        expect.objectContaining({ code: "missing-block", slot: "kpis" }),
      ]),
    });
  });

  it("shows Ben the words Ana types into the intent", async () => {
    const { ana, ben } = await renderPair();
    await userEvent.click(ana.getByText("Checkout"));
    await userEvent.keyboard("{End} under 200 ms");
    await expect.element(ben.getByText(/Checkout under 200 ms/)).toBeVisible();
  });

  it("lists Ana in Ben's presence bar with the section she is editing", async () => {
    const { ana, ben } = await renderPair();
    await userEvent.click(ana.getByText("Checkout"));
    await expect.element(ben.getByText(`Ana in ${FIRST_TITLE}`)).toBeVisible();
  });

  it("draws Ana's cursor labelled with her name in Ben's editor", async () => {
    const { ana, ben } = await renderPair();
    await userEvent.click(ana.getByText("Checkout"));
    await userEvent.keyboard("{End}!");
    await expect
      .element(ben.getByText("Ana", { exact: true }))
      .toBeInTheDocument();
  });
});
