import { describe, it, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import type { BlockJson, PlanDocument } from "@re-cinq/planning-document";
import { applyOpsToDoc, proposeRefine } from "@re-cinq/planning-yjs";

import { PlanEditor } from "../PlanEditor.js";
import { createMemoryHub } from "../session/memory-hub.js";
import { ANA, lastCallOf, planSeed, textBlock } from "../testing/fixtures.js";
import type { RefineRequest } from "./plan-actions.js";

const SEED = planSeed("feature", {
  questions: [
    textBlock(
      "question",
      { questionId: "q-target", kind: "choice", options: "300 ms, 200 ms" },
      "Which number do we stop at?",
    ),
    textBlock("answer", { questionId: "q-target" }, "300 ms"),
    textBlock(
      "comment",
      { commentId: "c1", author: "Ben", resolved: true },
      "Keep the cache under a minute.",
    ),
  ],
});

const STOP_AT = "We stop at 300 ms.";

type OnRefine = (request: RefineRequest) => Promise<void>;

const renderPlan = async (
  onRefine: (hub: ReturnType<typeof createMemoryHub>) => OnRefine,
) => {
  const hub = createMemoryHub(SEED);
  const onChange = vi.fn<(plan: PlanDocument) => void>();
  const screen = await render(
    <PlanEditor
      transport={hub.connect()}
      user={ANA}
      onChange={onChange}
      onRefine={onRefine(hub)}
    />,
  );
  const actions = screen.getByLabelText("Open questions actions");
  await expect.element(actions).toBeVisible();

  return { hub, screen, actions, lastPlan: () => lastCallOf(onChange) };
};

const agentProposes =
  (hub: ReturnType<typeof createMemoryHub>): OnRefine =>
  async ({ slot, baseHash, uses }) => {
    proposeRefine(hub.doc, {
      slot,
      baseHash,
      uses,
      ops: [{ op: "append-to-section", slot, paragraphs: [STOP_AT] }],
      proposedBy: "planning-agent",
    });
  };

const refine = (actions: Awaited<ReturnType<typeof renderPlan>>["actions"]) =>
  userEvent.click(actions.getByRole("button", { name: "Refine this section" }));

const questionsOf = (plan?: PlanDocument) => {
  const questions = plan?.sections.find((one) => one.slot === "questions");

  return questions?.blocks ?? [];
};

const isUsed = (block: BlockJson) =>
  (block.type === "question" || block.type === "comment") && block.props.used;

describe("RefineControls", () => {
  it("keeps Refine disabled for Success criteria, which has nothing answered or resolved", async () => {
    const { screen } = await renderPlan(() => vi.fn());
    await expect
      .element(
        screen
          .getByLabelText("Success criteria actions")
          .getByRole("button", { name: "Refine this section" }),
      )
      .toBeDisabled();
  });

  it("says Refine uses 1 answer and 1 resolved thread in the open questions", async () => {
    const { actions } = await renderPlan(() => vi.fn());
    await expect
      .element(actions.getByText("uses 1 answer, 1 resolved thread"))
      .toBeVisible();
  });

  it("hands the host the answered question q-target and the resolved thread c1", async () => {
    const onRefine = vi.fn<OnRefine>(() => Promise.resolve());
    const { actions } = await renderPlan(() => onRefine);
    await refine(actions);
    expect(onRefine).toHaveBeenCalledWith(
      expect.objectContaining({
        slot: "questions",
        uses: { questions: ["q-target"], comments: ["c1"] },
        inputs: expect.objectContaining({
          answered: [
            {
              questionId: "q-target",
              question: "Which number do we stop at?",
              answer: "300 ms",
            },
          ],
        }),
      }),
    );
  });

  it("tells everyone the agent is refining the open questions for Ana", async () => {
    const { actions } = await renderPlan(() => () => new Promise(() => {}));
    await refine(actions);
    await expect
      .element(actions.getByText("The agent is refining this for Ana…"))
      .toBeVisible();
  });

  it("withdraws Ana's ask when the host fails to refine", async () => {
    const { actions } = await renderPlan(
      () => () => Promise.reject(new Error("agent down")),
    );
    await refine(actions);
    await expect
      .element(actions.getByRole("button", { name: "Refine this section" }))
      .toBeEnabled();
  });

  it("shows the agent's paragraph as an added line before anyone accepts it", async () => {
    const { actions } = await renderPlan(agentProposes);
    await refine(actions);
    await expect
      .element(actions.getByRole("insertion").getByText(STOP_AT))
      .toBeVisible();
  });

  it("writes the paragraph into the plan on Accept and marks q-target and c1 as used", async () => {
    const { actions, lastPlan } = await renderPlan(agentProposes);
    await refine(actions);
    await userEvent.click(actions.getByRole("button", { name: "Accept" }));
    await expect
      .poll(() => questionsOf(lastPlan()).filter(isUsed))
      .toMatchObject([{ type: "comment" }, { type: "question" }]);
  });

  it("writes a stale proposal into the plan when Ana applies it anyway", async () => {
    const { hub, actions, lastPlan } = await renderPlan(agentProposes);
    await refine(actions);
    applyOpsToDoc(hub.doc, [
      {
        op: "append-to-section",
        slot: "questions",
        paragraphs: ["Ben typed."],
      },
    ]);
    await userEvent.click(
      actions.getByRole("button", { name: "Apply anyway" }),
    );
    await expect
      .poll(() => JSON.stringify(questionsOf(lastPlan())))
      .toContain(STOP_AT);
  });

  it("offers Ask again instead of Accept when the open questions changed after Ana asked", async () => {
    const { hub, actions } = await renderPlan(agentProposes);
    await refine(actions);
    applyOpsToDoc(hub.doc, [
      {
        op: "append-to-section",
        slot: "questions",
        paragraphs: ["Ben typed."],
      },
    ]);
    await expect
      .element(actions.getByRole("button", { name: "Ask again" }))
      .toBeVisible();
  });
});
