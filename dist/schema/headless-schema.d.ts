import { BlockNoteSchema } from "@blocknote/core";
export declare const headlessPlanSchema: BlockNoteSchema<import("@blocknote/core").BlockSchemaFromSpecs<{
    paragraph: import("@blocknote/core").BlockSpec<"paragraph", {
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
    heading: import("@blocknote/core").BlockSpec<"heading", {
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
    bulletListItem: import("@blocknote/core").BlockSpec<"bulletListItem", {
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
    numberedListItem: import("@blocknote/core").BlockSpec<"numberedListItem", {
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
    checkListItem: import("@blocknote/core").BlockSpec<"checkListItem", {
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
    quote: import("@blocknote/core").BlockSpec<"quote", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
    }, "inline">;
    codeBlock: import("@blocknote/core").BlockSpec<"codeBlock", {
        readonly language: {
            readonly default: string;
        };
    }, "plain">;
    table: import("@blocknote/core").LooseBlockSpec<"table", {
        textColor: {
            default: "default";
        };
    }, "table">;
}>, import("@blocknote/core").InlineContentSchemaFromSpecs<{
    text: {
        config: "text";
        implementation: any;
    };
    link: {
        config: "link";
        implementation: any;
    };
}>, import("@blocknote/core").StyleSchemaFromSpecs<{
    bold: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    italic: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    underline: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    strike: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    code: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    textColor: import("@blocknote/core").StyleSpec<{
        readonly type: "textColor";
        readonly propSchema: "string";
    }>;
    backgroundColor: import("@blocknote/core").StyleSpec<{
        readonly type: "backgroundColor";
        readonly propSchema: "string";
    }>;
}>>;
//# sourceMappingURL=headless-schema.d.ts.map