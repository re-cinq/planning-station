import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { templateFor } from "@re-cinq/planning-document";

import { TemplateOutline } from "./TemplateOutline.js";

const TEMPLATE = templateFor("performance");

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
});
