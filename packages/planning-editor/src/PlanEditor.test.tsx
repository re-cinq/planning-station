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
import {
  CHECKOUT_PLAN as SEED,
  editingAna,
  FIRST_TITLE,
  lastCallOf,
  planSeed,
  renderAsAna,
  renderPair,
  textBlock,
} from "./testing/fixtures.js";

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

const LONG_INTENT = planSeed("performance", {
  intent: [...Array(60).keys()].map((line) =>
    textBlock("paragraph", {}, `Line ${line}`),
  ),
});

const { slots: PERFORMANCE_SLOTS } = templateFor("performance");
const LAST_TITLE = PERFORMANCE_SLOTS.at(-1)?.title ?? "";

const isOnScreen = (element: Element) => {
  const rect = element.getBoundingClientRect();

  return rect.top >= 0 && rect.bottom <= window.innerHeight;
};

const renderPlan = async (extra: Partial<PlanEditorProps> = {}) => {
  const { props, lastPlan } = editingAna(SEED);
  const screen = await render(<PlanEditor {...props} {...extra} />);
  await expect.element(screen.getByRole("heading", firstHeading)).toBeVisible();

  return { screen, lastPlan };
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

  it("scrolls the last section's heading into view when its outline title is clicked", async () => {
    const { screen } = await renderAsAna(LONG_INTENT);
    const heading = screen.getByRole("heading", { name: LAST_TITLE });
    await expect.element(heading).toBeInTheDocument();
    const offScreenBefore = !isOnScreen(heading.element());
    await userEvent.click(
      screen
        .getByRole("navigation", { name: "Plan outline" })
        .getByRole("button", { name: LAST_TITLE }),
    );
    await expect.poll(() => isOnScreen(heading.element())).toBeTruthy();
    expect(offScreenBefore).toBe(true);
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

  it("says in the outline that Ana approved an approved plan", async () => {
    const approval = {
      mode: "manual" as const,
      approvedBy: "Ana",
      approvedAt: "2026-09-21T14:05:00.000Z",
      version: 3,
    };
    const { props } = editingAna({
      ...SEED,
      meta: { ...SEED.meta, status: "approved", approval },
    });
    const screen = await render(<PlanEditor {...props} />);
    await expect
      .element(
        screen
          .getByRole("navigation", { name: "Plan outline" })
          .getByText(/^Approved by Ana on /),
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

  it("marks the intent in the outline with 1 settled input once Ben's thread is resolved, and not before", async () => {
    const { screen } = await renderAsAna(
      planSeed("feature", {
        intent: [
          textBlock("paragraph", {}, "Checkout"),
          textBlock(
            "comment",
            { commentId: "c1", author: "Ben", at: "2026-09-18T09:12:00.000Z" },
            "Support tags this weekly.",
          ),
        ],
      }),
    );
    const waiting = screen
      .getByRole("navigation", { name: "Plan outline" })
      .getByRole("listitem", { name: FIRST_TITLE, exact: true })
      .getByText("1 settled input waiting for a refine");
    const thread = screen.getByLabelText("Comment by Ben");
    await expect.element(thread).toBeVisible();
    expect(waiting.query()).toBeNull();

    await userEvent.click(thread.getByRole("button", { name: "Resolve" }));
    await expect.element(waiting).toBeVisible();
  });

  it("shows Ben the words Ana types into the intent", async () => {
    const { ana, ben } = await renderPair(SEED);
    await userEvent.click(ana.getByText("Checkout"));
    await userEvent.keyboard("{End} under 200 ms");
    await expect.element(ben.getByText(/Checkout under 200 ms/)).toBeVisible();
  });
});
