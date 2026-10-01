import { PlanDocument, PlanMeta } from '@re-cinq/planning-document';
import { PlanBlockNoteEditor } from './schema/block-bridge.js';
import { PlanUser } from './session/plan-events.js';
import { PlanSession } from './session/plan-session.js';
import { ChangeHosts } from './schema/change-widgets.js';
export interface PlanEditorOptions {
    session: PlanSession;
    meta: PlanMeta;
    user: PlanUser;
    onChange?: (plan: PlanDocument) => void;
}
export declare function usePlanEditor({ session, meta, user, onChange, }: PlanEditorOptions): {
    editor: PlanBlockNoteEditor;
    plan: {
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
    };
    hosts: ChangeHosts;
};
