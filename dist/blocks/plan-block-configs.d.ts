export declare const KPI_DIRECTIONS: readonly ["up", "down", "hold"];
export declare const PROTOTYPE_MATURITIES: readonly ["none", "click-dummy", "running-prototype", "pre-prod"];
export declare const MOCKUP_FORMATS: readonly ["svg", "mermaid", "html", "text"];
export declare const MOCKUP_KINDS: readonly ["architecture", "flow", "ui", "data-model", "states", "api", "text-output"];
export declare const MOCKUP_MARKUP_MAX = 60000;
export declare const MOCKUP_CAPTION_MAX = 120;
export declare const MOCKUP_HEIGHT_DEFAULT = 320;
export declare const MOCKUP_HEIGHT_MIN = 80;
export declare const MOCKUP_HEIGHT_MAX = 2000;
export declare const QUESTION_KINDS: readonly ["text", "choice"];
export declare const FINDING_SEVERITIES: readonly ["blocker", "warning"];
export declare const PLAN_BLOCK_CONFIGS: {
    readonly "plan-title": {
        readonly type: "plan-title";
        readonly content: "inline";
        readonly propSchema: {
            readonly droppedSlots: {
                readonly default: "";
            };
        };
    };
    readonly "section-heading": {
        readonly type: "section-heading";
        readonly content: "none";
        readonly propSchema: {
            readonly slot: {
                readonly default: "";
            };
            readonly title: {
                readonly default: "";
            };
        };
    };
    readonly "section-panel": {
        readonly type: "section-panel";
        readonly content: "none";
        readonly propSchema: {
            readonly slot: {
                readonly default: "";
            };
        };
    };
    readonly "section-actions": {
        readonly type: "section-actions";
        readonly content: "none";
        readonly propSchema: {
            readonly slot: {
                readonly default: "";
            };
        };
    };
    readonly comment: {
        readonly type: "comment";
        readonly content: "inline";
        readonly propSchema: {
            readonly commentId: {
                readonly default: "";
            };
            readonly replyTo: {
                readonly default: "";
            };
            readonly author: {
                readonly default: "";
            };
            readonly at: {
                readonly default: "";
            };
            readonly resolved: {
                readonly default: false;
            };
            readonly used: {
                readonly default: false;
            };
        };
    };
    readonly kpi: {
        readonly type: "kpi";
        readonly content: "inline";
        readonly propSchema: {
            readonly kpiId: {
                readonly default: "";
            };
            readonly metric: {
                readonly default: "";
            };
            readonly baseline: {
                readonly default: "";
            };
            readonly target: {
                readonly default: "";
            };
            readonly direction: {
                readonly default: "up";
                readonly values: readonly ["up", "down", "hold"];
            };
            readonly deadline: {
                readonly default: "";
            };
        };
    };
    readonly prototype: {
        readonly type: "prototype";
        readonly content: "inline";
        readonly propSchema: {
            readonly maturity: {
                readonly default: "none";
                readonly values: readonly ["none", "click-dummy", "running-prototype", "pre-prod"];
            };
            readonly url: {
                readonly default: "";
            };
            readonly agreedBy: {
                readonly default: "";
            };
        };
    };
    readonly mockup: {
        readonly type: "mockup";
        readonly content: "none";
        readonly propSchema: {
            readonly mockupId: {
                readonly default: "";
            };
            readonly kind: {
                readonly default: "";
                readonly values: readonly ["", "architecture", "flow", "ui", "data-model", "states", "api", "text-output"];
            };
            readonly caption: {
                readonly default: "";
            };
            readonly format: {
                readonly default: "svg";
                readonly values: readonly ["svg", "mermaid", "html", "text"];
            };
            readonly markup: {
                readonly default: "";
            };
            readonly height: {
                readonly default: 320;
            };
        };
    };
    readonly question: {
        readonly type: "question";
        readonly content: "inline";
        readonly propSchema: {
            readonly questionId: {
                readonly default: "";
            };
            readonly why: {
                readonly default: "";
            };
            readonly kind: {
                readonly default: "text";
                readonly values: readonly ["text", "choice"];
            };
            readonly options: {
                readonly default: "";
            };
            readonly used: {
                readonly default: false;
            };
        };
    };
    readonly answer: {
        readonly type: "answer";
        readonly content: "inline";
        readonly propSchema: {
            readonly questionId: {
                readonly default: "";
            };
        };
    };
    readonly finding: {
        readonly type: "finding";
        readonly content: "inline";
        readonly propSchema: {
            readonly findingId: {
                readonly default: "";
            };
            readonly severity: {
                readonly default: "warning";
                readonly values: readonly ["blocker", "warning"];
            };
            readonly why: {
                readonly default: "";
            };
            readonly resolved: {
                readonly default: false;
            };
            readonly used: {
                readonly default: false;
            };
        };
    };
};
export type PlanBlockConfigs = typeof PLAN_BLOCK_CONFIGS;
export type PlanBlockKind = keyof PlanBlockConfigs;
export declare const PLAN_BLOCK_KINDS: PlanBlockKind[];
//# sourceMappingURL=plan-block-configs.d.ts.map