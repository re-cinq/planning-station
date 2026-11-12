import { describe, it, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { templateFor, type SectionSlot } from "@re-cinq/planning-document";

import { TemplateOutline } from "./TemplateOutline.js";

const TEMPLATE = templateFor("performance");

const alwaysRequired = (slot: SectionSlot) => ({
  ...slot,
  required: "always" as const,
});

const HEADINGS = TEMPLATE.slots.map(({ slot, title }) => ({ slot, title }));

describe("TemplateOutline", () => {
  it("lists the missing KPI under Success criteria", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{
          passed: false,
          phase: "approval",
          problems: [
            {
              code: "missing-block",
              slot: "kpis",
              message: '"Success criteria" needs at least 1 kpi',
            },
          ],
        }}
      />,
    );
    await expect
      .element(
        screen
          .getByRole("listitem", {
            name: "Success criteria, needs work",
            exact: true,
          })
          .getByText('"Success criteria" needs at least 1 kpi'),
      )
      .toBeVisible();
  });

  it("marks Success criteria as holding 2 settled inputs no refine has used", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        sections={HEADINGS}
        settled={new Map([["kpis", 2]])}
      />,
    );
    await expect
      .element(
        screen
          .getByRole("listitem", {
            name: "Success criteria, ready",
            exact: true,
          })
          .getByText("2 settled inputs waiting for a refine"),
      )
      .toBeVisible();
  });

  it("says one settled input in the singular", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        settled={new Map([["kpis", 1]])}
      />,
    );
    await expect
      .element(screen.getByText("1 settled input waiting for a refine"))
      .toBeVisible();
  });

  it("says a passing plan is ready for approval", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
      />,
    );
    await expect.element(screen.getByText("Ready for approval")).toBeVisible();
  });

  it("says Ana approved the plan on its approval date instead of ready for approval", async () => {
    const approvedAt = "2026-09-21T14:05:00.000Z";
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        approval={{ mode: "manual", approvedBy: "Ana", approvedAt, version: 3 }}
      />,
    );
    await expect
      .element(
        screen.getByText(
          `Approved by Ana on ${new Date(approvedAt).toLocaleDateString()}`,
        ),
      )
      .toBeVisible();
    expect(screen.container.textContent).not.toContain("Ready for approval");
  });

  it("lists the agent's Rollout section where the plan has it, never marked required", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        sections={HEADINGS.toSpliced(1, 0, {
          slot: "custom-rollout",
          title: "Rollout",
        })}
      />,
    );
    const entries = [...screen.container.querySelectorAll("ol > li")];
    expect(
      entries.slice(0, 3).map((entry) => ({
        label: entry.getAttribute("aria-label"),
        required: entry.textContent.includes("required"),
      })),
    ).toEqual([
      { label: "What we want and why, ready", required: true },
      { label: "Rollout, ready", required: false },
      { label: "Success criteria, ready", required: true },
    ]);
  });

  it("hands onLocate the kpis slot when Success criteria is clicked", async () => {
    const onLocate = vi.fn<(slot: string) => void>();
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        sections={HEADINGS}
        onLocate={onLocate}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Success criteria" }),
    );
    expect(onLocate.mock.calls).toEqual([["kpis"]]);
  });

  it("keeps Success criteria as plain text when the plan lacks that section", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        sections={HEADINGS.filter(({ slot }) => slot !== "kpis")}
        onLocate={vi.fn()}
      />,
    );
    await expect
      .element(
        screen.getByRole("listitem", {
          name: "Success criteria, not in the plan",
        }),
      )
      .toBeVisible();
    expect(
      screen.getByRole("button", { name: "Success criteria" }).query(),
    ).toBeNull();
  });

  it("says 2 of 3 required sections ready", async () => {
    const firstThree = TEMPLATE.slots.slice(0, 3);
    const threeRequired = {
      ...TEMPLATE,
      slots: firstThree.map(alwaysRequired),
    };
    const screen = await render(
      <TemplateOutline
        template={threeRequired}
        report={{
          passed: false,
          phase: "approval",
          problems: [
            { code: "missing-block", slot: "scope", message: "needs content" },
          ],
        }}
        sections={HEADINGS}
      />,
    );
    await expect
      .element(screen.getByText("2 of 3 required sections ready"))
      .toBeVisible();
    expect(screen.getByRole("progressbar").element()).toMatchObject({
      value: 2,
      max: 3,
    });
  });

  it("marks Prototype as needs work", async () => {
    const featureTemplate = templateFor("feature");
    const screen = await render(
      <TemplateOutline
        template={featureTemplate}
        report={{
          passed: false,
          phase: "approval",
          problems: [
            { code: "missing-block", slot: "prototype", message: "add one" },
          ],
        }}
        sections={featureTemplate.slots.map(({ slot, title }) => ({
          slot,
          title,
        }))}
      />,
    );
    await expect
      .element(screen.getByRole("listitem", { name: "Prototype, needs work" }))
      .toBeVisible();
  });

  it("shows no progress line on an approved plan", async () => {
    const screen = await render(
      <TemplateOutline
        template={TEMPLATE}
        report={{ passed: true, phase: "approval", problems: [] }}
        sections={HEADINGS}
        approval={{
          mode: "manual",
          approvedBy: "Ana",
          approvedAt: "2026-09-21T14:05:00.000Z",
          version: 3,
        }}
      />,
    );
    expect(screen.container.textContent).not.toContain("required sections");
  });
});
