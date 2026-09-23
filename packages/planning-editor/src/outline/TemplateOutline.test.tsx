import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { templateFor } from "@re-cinq/planning-document";

import { TemplateOutline } from "./TemplateOutline.js";

const TEMPLATE = templateFor("performance");

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
          .getByRole("listitem", { name: "Success criteria", exact: true })
          .getByText('"Success criteria" needs at least 1 kpi'),
      )
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
    expect(entries.slice(0, 3).map((entry) => entry.textContent)).toEqual([
      "What we want and why required",
      "Rollout",
      "Success criteria required",
    ]);
  });
});
