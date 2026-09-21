import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { toPlanDocument, type PlanDocument } from "@re-cinq/planning-document";
import {
  planMeta,
  planWith,
  textBlock,
} from "@re-cinq/planning-document/testing";

import { PlanDiffView } from "./PlanDiffView.js";

const planOf = (intent: string[], version = 1): PlanDocument => ({
  ...toPlanDocument(
    planWith("feature", {
      intent: intent.map((text) => textBlock("paragraph", {}, text)),
    }),
    planMeta("feature"),
  ),
  version,
});

const BEFORE = planOf(["Checkout is slow."]);

describe("PlanDiffView", () => {
  it("shows the paragraph the newer version added", async () => {
    const after = planOf(["Checkout is slow.", "Mobile suffers most."]);
    const screen = await render(<PlanDiffView before={BEFORE} after={after} />);
    await expect
      .element(screen.getByText(/\+ Mobile suffers most\./))
      .toBeVisible();
  });

  it("names the section the change belongs to", async () => {
    const after = planOf(["Something else."]);
    const screen = await render(<PlanDiffView before={BEFORE} after={after} />);
    await expect
      .element(screen.getByRole("heading", { name: "What we want and why" }))
      .toBeVisible();
  });

  it("reports the version a reader is comparing against", async () => {
    const screen = await render(
      <PlanDiffView before={BEFORE} after={planOf(["Other."], 2)} />,
    );
    await expect
      .element(screen.getByLabelText("Changes from version 1 to 2"))
      .toBeVisible();
  });

  it("says nothing changed between two identical versions", async () => {
    const screen = await render(
      <PlanDiffView before={BEFORE} after={BEFORE} />,
    );
    await expect.element(screen.getByText("Nothing changed")).toBeVisible();
  });
});
