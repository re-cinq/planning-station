// Single source for custom blocks: editor BlockNote specs and contract zod schemas are both built from it.

export const KPI_DIRECTIONS = ["up", "down", "hold"] as const;
export const PROTOTYPE_MATURITIES = [
  "none",
  "click-dummy",
  "running-prototype",
  "pre-prod",
] as const;
export const MOCKUP_FORMATS = ["svg", "mermaid", "html", "text"] as const;
export const MOCKUP_KINDS = [
  "architecture",
  "flow",
  "ui",
  "data-model",
  "states",
  "api",
  "text-output",
] as const;
export const MOCKUP_MARKUP_MAX = 60_000;
export const MOCKUP_CAPTION_MAX = 120;
export const MOCKUP_HEIGHT_DEFAULT = 320;
export const MOCKUP_HEIGHT_MIN = 80;
export const MOCKUP_HEIGHT_MAX = 2000;
export const QUESTION_KINDS = ["text", "choice"] as const;
export const FINDING_SEVERITIES = ["blocker", "warning"] as const;

export const PLAN_BLOCK_CONFIGS = {
  "plan-title": {
    type: "plan-title",
    content: "inline",
    // The slots removed from the plan, comma-joined: BlockNote props are primitives.
    propSchema: { droppedSlots: { default: "" } },
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
      mockupId: { default: "" },
      // Blocks written before sketches had kinds carry "".
      kind: { default: "", values: ["", ...MOCKUP_KINDS] },
      caption: { default: "" },
      format: { default: "svg", values: MOCKUP_FORMATS },
      markup: { default: "" },
      height: { default: MOCKUP_HEIGHT_DEFAULT },
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
  finding: {
    type: "finding",
    content: "inline",
    propSchema: {
      findingId: { default: "" },
      severity: { default: "warning", values: FINDING_SEVERITIES },
      why: { default: "" },
      resolved: { default: false },
      used: { default: false },
    },
  },
} as const;

export type PlanBlockConfigs = typeof PLAN_BLOCK_CONFIGS;
export type PlanBlockKind = keyof PlanBlockConfigs;

export const PLAN_BLOCK_KINDS = Object.keys(
  PLAN_BLOCK_CONFIGS,
) as PlanBlockKind[];
