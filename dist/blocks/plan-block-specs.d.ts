export declare const PLAN_BLOCK_SPECS: {
    "plan-title": import('@blocknote/core').BlockSpec<"plan-title", {}, "inline">;
    "section-heading": import('@blocknote/core').BlockSpec<"section-heading", {
        readonly slot: {
            readonly default: "";
        };
        readonly title: {
            readonly default: "";
        };
    }, "none">;
    "section-panel": import('@blocknote/core').BlockSpec<"section-panel", {
        readonly slot: {
            readonly default: "";
        };
    }, "none">;
    "section-actions": import('@blocknote/core').BlockSpec<"section-actions", {
        readonly slot: {
            readonly default: "";
        };
    }, "none">;
    comment: import('@blocknote/core').BlockSpec<"comment", {
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
    }, "inline">;
    kpi: import('@blocknote/core').BlockSpec<"kpi", {
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
    }, "inline">;
    prototype: import('@blocknote/core').BlockSpec<"prototype", {
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
    }, "inline">;
    mockup: import('@blocknote/core').BlockSpec<"mockup", {
        readonly format: {
            readonly default: "svg";
            readonly values: readonly ["svg", "mermaid", "html"];
        };
        readonly markup: {
            readonly default: "";
        };
        readonly height: {
            readonly default: 320;
        };
    }, "none">;
    question: import('@blocknote/core').BlockSpec<"question", {
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
    }, "inline">;
    answer: import('@blocknote/core').BlockSpec<"answer", {
        readonly questionId: {
            readonly default: "";
        };
    }, "inline">;
};
