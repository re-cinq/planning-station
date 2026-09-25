import type { SectionSlot } from "./template.js";
/** Blocks every section carries, whatever its template says. */
export declare const ALWAYS_ALLOWED: readonly ["section-panel", "section-actions", "question", "answer", "comment", "finding"];
/** Margin notes: they lead a section in this order. */
export declare const MARGIN_NOTES: readonly string[];
/** Closes every section, under what people wrote. */
export declare const SECTION_ACTIONS = "section-actions";
/** A section holding only these is still an empty section. */
export declare const NOT_CONTENT: readonly string[];
export declare const SLOTS: {
    readonly intent: {
        readonly slot: "intent";
        readonly title: "What we want and why";
        readonly required: "always";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "Two paragraphs a director would read. No implementation.";
    };
    readonly kpis: {
        readonly slot: "kpis";
        readonly title: "Success criteria";
        readonly required: "always";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table", "kpi"];
        readonly requires: readonly [{
            readonly block: "kpi";
            readonly min: 1;
        }];
        readonly hint: "Each KPI: the metric, where it is now, where it must be, and by when.";
    };
    readonly scope: {
        readonly slot: "scope";
        readonly title: "In and out of scope";
        readonly required: "for-approval";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "What this plan changes, and what it deliberately leaves alone.";
    };
    readonly prototype: {
        readonly slot: "prototype";
        readonly title: "Prototype";
        readonly required: "for-approval";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table", "prototype", "mockup"];
        readonly requires: readonly [{
            readonly block: "prototype";
            readonly min: 1;
            readonly max: 1;
        }];
        readonly hint: "Agree the maturity first: click-dummy or running-prototype.";
    };
    readonly constraints: {
        readonly slot: "constraints";
        readonly title: "Constraints";
        readonly required: "optional";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "Budgets, deadlines, regulation, technology that is ruled out.";
    };
    readonly ownership: {
        readonly slot: "ownership";
        readonly title: "Who operates it";
        readonly required: "for-approval";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "The team that runs this in production and answers the pager.";
    };
    readonly delivery: {
        readonly slot: "delivery";
        readonly title: "Delivery implications";
        readonly required: "optional";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "Rollout, migrations, communication, other teams involved.";
    };
    readonly risk: {
        readonly slot: "risk";
        readonly title: "What could break";
        readonly required: "for-approval";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "The blast radius if this goes wrong, and how we would notice.";
    };
    readonly trigger: {
        readonly slot: "trigger";
        readonly title: "What happened";
        readonly required: "always";
        readonly allows: readonly ["paragraph", "heading", "bulletListItem", "numberedListItem", "checkListItem", "quote", "codeBlock", "table"];
        readonly requires: readonly [];
        readonly hint: "The incident or signal that started this plan, with links.";
    };
    readonly questions: {
        readonly slot: "questions";
        readonly title: "Open questions";
        readonly required: "optional";
        readonly allows: readonly ["question", "answer", "paragraph"];
        readonly requires: readonly [];
        readonly hint: "What the agent needs a person to decide.";
    };
};
/** Whether a section of this slot may hold a block of this type: what its template allows, or what every section carries. */
export declare function allowsBlock(slot: SectionSlot, type: string): boolean;
export declare function disallowedBlockMessage(slot: SectionSlot, type: string): string;
//# sourceMappingURL=slots.d.ts.map