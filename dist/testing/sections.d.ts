import { PlanDocument } from '@re-cinq/planning-document';
import { renderAsAna } from './fixtures.js';
export declare const EMPTY_PLAN: import('../index.js').PlanSeed;
export declare const renderEmpty: (seed?: import('../index.js').PlanSeed) => Promise<{
    screen: import('vitest-browser-react').RenderResult;
    lastPlan: () => {
        schemaVersion: 1;
        id: string;
        repo: string;
        type: "feature" | "ui-change" | "performance" | "refactor" | "incident-response";
        templateVersion: number;
        title: string;
        status: "draft" | "in-review" | "approved" | "superseded";
        approval: {
            mode: "manual" | "automatic";
            approvedBy: string;
            approvedAt: string;
            version: number;
        } | null;
        version: number;
        createdBy: string;
        updatedAt: string;
        sections: {
            headingId: string;
            slot: string;
            title: string;
            blocks: import('@re-cinq/planning-document').BlockJson[];
        }[];
        kpis: {
            id: string;
            metric: string;
            baseline: string;
            target: string;
            direction: "up" | "down" | "hold";
            deadline: string;
            rationale: string;
        }[];
        prototype: {
            maturity: "none" | "click-dummy" | "running-prototype" | "pre-prod";
            url: string;
            agreedBy: string;
            notes: string;
        } | null;
        droppedSlots: string[];
    } | undefined;
}>;
export declare const REFINE_NOTE = "Answer a question or resolve a thread to refine";
export declare const renderRefinable: () => Promise<{
    screen: import('vitest-browser-react').RenderResult;
    lastPlan: () => {
        schemaVersion: 1;
        id: string;
        repo: string;
        type: "feature" | "ui-change" | "performance" | "refactor" | "incident-response";
        templateVersion: number;
        title: string;
        status: "draft" | "in-review" | "approved" | "superseded";
        approval: {
            mode: "manual" | "automatic";
            approvedBy: string;
            approvedAt: string;
            version: number;
        } | null;
        version: number;
        createdBy: string;
        updatedAt: string;
        sections: {
            headingId: string;
            slot: string;
            title: string;
            blocks: import('@re-cinq/planning-document').BlockJson[];
        }[];
        kpis: {
            id: string;
            metric: string;
            baseline: string;
            target: string;
            direction: "up" | "down" | "hold";
            deadline: string;
            rationale: string;
        }[];
        prototype: {
            maturity: "none" | "click-dummy" | "running-prototype" | "pre-prod";
            url: string;
            agreedBy: string;
            notes: string;
        } | null;
        droppedSlots: string[];
    } | undefined;
}>;
export declare const pasteInto: (target: Element, text: string) => void;
export declare const greyedRefineOf: (screen: Awaited<ReturnType<typeof renderAsAna>>["screen"]) => import('vitest/browser').Locator;
export declare const intentOf: (plan: PlanDocument | undefined) => {
    written: import('@re-cinq/planning-document').BlockJson[];
    last: "plan-title" | "section-heading" | "section-panel" | "section-actions" | "comment" | "kpi" | "prototype" | "mockup" | "question" | "answer" | "finding" | "paragraph" | "heading" | "bulletListItem" | "numberedListItem" | "checkListItem" | "quote" | "codeBlock" | "table" | undefined;
};
export declare const intentText: (plan: PlanDocument | undefined) => string;
