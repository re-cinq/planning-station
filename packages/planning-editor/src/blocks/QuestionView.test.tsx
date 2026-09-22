import { describe, it, expect } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { encodeOptions } from "@re-cinq/planning-document";

import { PlanEditor } from "../PlanEditor.js";
import { editingAna, planSeed, textBlock } from "../testing/fixtures.js";

const SEED = planSeed("feature", {
  questions: [
    textBlock(
      "question",
      {
        questionId: "q1",
        why: "the agent needs one number",
        kind: "choice",
        options: "200 ms, 150 ms",
      },
      "How fast must the price step be?",
    ),
  ],
});

const buttonsNamed = (container: HTMLElement, name: string) => () =>
  [...container.querySelectorAll("button")].filter(
    (button) => button.textContent === name,
  ).length;

const renderPlan = async () => {
  const editing = editingAna(SEED);
  const screen = await render(<PlanEditor {...editing.props} />);
  await expect
    .element(screen.getByText("How fast must the price step be?"))
    .toBeVisible();

  return { screen, lastPlan: editing.lastPlan };
};

describe("QuestionView", () => {
  it("shows why the agent is asking", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByText("the agent needs one number"))
      .toBeVisible();
  });

  it("offers each suggested answer as a button", async () => {
    const { screen } = await renderPlan();
    await expect
      .element(screen.getByRole("button", { name: "150 ms" }))
      .toBeVisible();
  });

  it("stops offering suggestions once the question is answered", async () => {
    const { screen } = await renderPlan();
    await userEvent.click(screen.getByRole("button", { name: "150 ms" }));
    await expect.poll(buttonsNamed(screen.container, "200 ms")).toBe(0);
  });

  it("answers the question with the suggestion that was chosen", async () => {
    const { screen, lastPlan } = await renderPlan();
    await userEvent.click(screen.getByRole("button", { name: "200 ms" }));
    const questions = lastPlan()?.sections.find(
      (section) => section.slot === "questions",
    );
    expect(questions?.blocks).toMatchObject([
      { type: "section-panel" },
      { type: "question" },
      { type: "answer", props: { questionId: "q1" } },
      { type: "section-actions" },
    ]);
  });
});

const TEXT_SEED = planSeed("feature", {
  questions: [
    textBlock(
      "question",
      { questionId: "q2", why: "a cache miss must never block", kind: "text" },
      "What does a shopper see when the tax service is down?",
    ),
  ],
});

const renderTextQuestion = async () => {
  const editing = editingAna(TEXT_SEED);
  const screen = await render(<PlanEditor {...editing.props} />);
  await expect.element(screen.getByLabelText("Your answer")).toBeVisible();

  return { screen, lastPlan: editing.lastPlan };
};

describe("QuestionView with an option that carries a comma", () => {
  const seed = planSeed("feature", {
    questions: [
      textBlock(
        "question",
        {
          questionId: "q3",
          why: "the agent needs the trigger",
          kind: "choice",
          options: encodeOptions([
            "Nightly batch (simpler, matches existing pattern)",
            "Post-merge trigger (fresher, more complex)",
          ]),
        },
        "When do the metrics refresh?",
      ),
    ],
  });

  it("offers the whole option as one answer, not one button per comma", async () => {
    const screen = await render(<PlanEditor {...editingAna(seed).props} />);
    await expect
      .element(
        screen.getByRole("button", {
          name: "Nightly batch (simpler, matches existing pattern)",
        }),
      )
      .toBeVisible();
    await expect
      .poll(buttonsNamed(screen.container, "Nightly batch (simpler"))
      .toBe(0);
  });
});

describe("QuestionView with a written answer", () => {
  it("answers q2 with 'The last known price' when it is typed and sent", async () => {
    const { screen, lastPlan } = await renderTextQuestion();
    await userEvent.fill(
      screen.getByLabelText("Your answer"),
      "The last known price",
    );
    await userEvent.click(screen.getByRole("button", { name: "Answer" }));
    const questions = lastPlan()?.sections.find(
      (section) => section.slot === "questions",
    );
    expect(questions?.blocks[2]).toMatchObject({
      type: "answer",
      props: { questionId: "q2" },
    });
  });

  it("asks for a written answer rather than a pick", async () => {
    const { screen } = await renderTextQuestion();
    await expect.element(screen.getByText("Write the answer")).toBeVisible();
  });
});
