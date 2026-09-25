import { BlockNoteSchema } from '@blocknote/core';
export declare const planSchema: BlockNoteSchema<import('@blocknote/core').BlockSchemaFromSpecs<{
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
    finding: import('@blocknote/core').BlockSpec<"finding", {
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
    paragraph: import('@blocknote/core').BlockSpec<"paragraph", {
        backgroundColor: {
            default: "default";
        };
        textColor: {
            default: "default";
        };
        textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
    }, "inline">;
    heading: import('@blocknote/core').BlockSpec<"heading", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly level: {
            readonly default: 1 | 2 | 3 | 4 | 5 | 6;
            readonly values: readonly number[];
        };
        readonly isToggleable?: {
            readonly default: false;
            readonly optional: true;
        } | undefined;
    }, "inline">;
    bulletListItem: import('@blocknote/core').BlockSpec<"bulletListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
    }, "inline">;
    numberedListItem: import('@blocknote/core').BlockSpec<"numberedListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly start: {
            readonly default: undefined;
            readonly type: "number";
        };
    }, "inline">;
    checkListItem: import('@blocknote/core').BlockSpec<"checkListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly checked: {
            readonly default: false;
            readonly type: "boolean";
        };
    }, "inline">;
    quote: import('@blocknote/core').BlockSpec<"quote", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
    }, "inline">;
    codeBlock: import('@blocknote/core').BlockSpec<"codeBlock", {
        readonly language: {
            readonly default: string;
        };
    }, "plain">;
    table: import('@blocknote/core').LooseBlockSpec<"table", {
        textColor: {
            default: "default";
        };
    }, "table">;
}>, import('@blocknote/core').InlineContentSchemaFromSpecs<{
    text: {
        config: "text";
        implementation: any;
    };
    link: {
        config: "link";
        implementation: any;
    };
}>, import('@blocknote/core').StyleSchemaFromSpecs<{
    bold: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import('@blocknote/core').StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    italic: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import('@blocknote/core').StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    underline: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import('@blocknote/core').StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    strike: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import('@blocknote/core').StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    code: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import('@blocknote/core').StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    textColor: import('@blocknote/core').StyleSpec<{
        readonly type: "textColor";
        readonly propSchema: "string";
    }>;
    backgroundColor: import('@blocknote/core').StyleSpec<{
        readonly type: "backgroundColor";
        readonly propSchema: "string";
    }>;
}>>;
export type PlanSchema = typeof planSchema;
