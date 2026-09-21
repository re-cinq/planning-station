// Single source for custom blocks: editor BlockNote specs and contract zod schemas are both built from it.

export const KPI_DIRECTIONS = ["up", "down", "hold"] as const;
export const PROTOTYPE_MATURITIES = [
  "none",
  "click-dummy",
  "running-prototype",
  "pre-prod",
] as const;
export const MOCKUP_FORMATS = ["svg", "mermaid", "html"] as const;
export const QUESTION_KINDS = ["text", "choice"] as const;

export const PLAN_BLOCK_CONFIGS = {
  "plan-title": {
    type: "plan-title",
    content: "inline",
    propSchema: {},
  },
  "section-heading": {
    type: "section-heading",
    content: "none",
    propSchema: { slot: { default: "" }, title: { default: "" } },
  },
  "section-panel": {
    type: "section-panel",
    content: "none",
    propSchema: { slot: { default: "" } },
  },
  "section-actions": {
    type: "section-actions",
    content: "none",
    propSchema: { slot: { default: "" } },
  },
  comment: {
    type: "comment",
    content: "inline",
    propSchema: {
      commentId: { default: "" },
      replyTo: { default: "" },
      author: { default: "" },
      at: { default: "" },
      resolved: { default: false },
      used: { default: false },
    },
  },
  kpi: {
    type: "kpi",
    content: "inline",
    propSchema: {
      kpiId: { default: "" },
      metric: { default: "" },
      baseline: { default: "" },
      target: { default: "" },
      direction: { default: "up", values: KPI_DIRECTIONS },
      deadline: { default: "" },
    },
  },
  prototype: {
    type: "prototype",
    content: "inline",
    propSchema: {
      maturity: {
        default: "none",
        values: PROTOTYPE_MATURITIES,
      },
      url: { default: "" },
      agreedBy: { default: "" },
    },
  },
  mockup: {
    type: "mockup",
    content: "none",
    propSchema: {
      format: { default: "svg", values: MOCKUP_FORMATS },
      markup: { default: "" },
      height: { default: 320 },
    },
  },
  question: {
    type: "question",
    content: "inline",
    propSchema: {
      questionId: { default: "" },
      why: { default: "" },
      kind: { default: "text", values: QUESTION_KINDS },
      options: { default: "" },
      used: { default: false },
    },
  },
  answer: {
    type: "answer",
    content: "inline",
    propSchema: { questionId: { default: "" } },
  },
} as const;

export type PlanBlockConfigs = typeof PLAN_BLOCK_CONFIGS;
export type PlanBlockKind = keyof PlanBlockConfigs;

export const PLAN_BLOCK_KINDS = Object.keys(
  PLAN_BLOCK_CONFIGS,
) as PlanBlockKind[];
