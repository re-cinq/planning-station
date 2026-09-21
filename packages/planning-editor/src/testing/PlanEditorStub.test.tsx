import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";

import { planMeta, planWith, textBlock } from "./fixtures.js";
import { PlanEditorStub } from "./PlanEditorStub.js";

describe("PlanEditorStub", () => {
  it("renders the intent section with its paragraph as static text", async () => {
    const screen = await render(
      <PlanEditorStub
        meta={planMeta("feature")}
        initialBlocks={planWith("feature", {
          intent: [textBlock("paragraph", {}, "Faster checkout")],
        })}
      />,
    );
    await expect
      .element(
        screen
          .getByRole("region", { name: "What we want and why" })
          .getByText("Faster checkout"),
      )
      .toBeVisible();
  });
});
