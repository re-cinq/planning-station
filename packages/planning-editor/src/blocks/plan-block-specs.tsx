import { createReactBlockSpec } from "@blocknote/react";
import { PLAN_BLOCK_CONFIGS } from "@re-cinq/planning-document";

import { CommentView } from "./CommentView.js";
import { FindingView } from "./FindingView.js";
import { MockupView } from "./MockupView.js";
import { PlanBlockView } from "./PlanBlockView.js";
import { PlanTitleView } from "./PlanTitleView.js";
import { QuestionView } from "./QuestionView.js";
import { SectionActions } from "./SectionActions.js";
import { SectionHeading } from "./SectionHeading.js";
import { SectionPanel } from "./SectionPanel.js";

const view = { render: PlanBlockView };

export const PLAN_BLOCK_SPECS = {
  "plan-title": createReactBlockSpec(PLAN_BLOCK_CONFIGS["plan-title"], {
    render: PlanTitleView,
  })(),
  "section-heading": createReactBlockSpec(
    PLAN_BLOCK_CONFIGS["section-heading"],
    { render: SectionHeading },
  )(),
  "section-panel": createReactBlockSpec(PLAN_BLOCK_CONFIGS["section-panel"], {
    render: SectionPanel,
  })(),
  "section-actions": createReactBlockSpec(
    PLAN_BLOCK_CONFIGS["section-actions"],
    { render: SectionActions },
  )(),
  comment: createReactBlockSpec(PLAN_BLOCK_CONFIGS.comment, {
    render: CommentView,
  })(),
  finding: createReactBlockSpec(PLAN_BLOCK_CONFIGS.finding, {
    render: FindingView,
  })(),
  kpi: createReactBlockSpec(PLAN_BLOCK_CONFIGS.kpi, view)(),
  prototype: createReactBlockSpec(PLAN_BLOCK_CONFIGS.prototype, view)(),
  mockup: createReactBlockSpec(PLAN_BLOCK_CONFIGS.mockup, {
    render: MockupView,
  })(),
  question: createReactBlockSpec(PLAN_BLOCK_CONFIGS.question, {
    render: QuestionView,
  })(),
  answer: createReactBlockSpec(PLAN_BLOCK_CONFIGS.answer, view)(),
};
