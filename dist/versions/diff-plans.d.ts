import type { PlanDocument } from "../plan/plan-document.js";
import { type LineChange } from "../lib/diff-lines.js";
export declare const ENTITY_CHANGES: readonly ["added", "removed", "changed"];
export type EntityChangeKind = (typeof ENTITY_CHANGES)[number];
export interface EntityChange {
    id: string;
    kind: EntityChangeKind;
}
export interface SectionDiff {
    slot: string;
    title: string;
    lines: LineChange[];
}
export interface MetaChange {
    field: string;
    before: string;
    after: string;
}
export interface PlanDiff {
    meta: MetaChange[];
    sections: SectionDiff[];
    kpis: EntityChange[];
}
/** What changed between two versions of a plan, in the words people wrote. */
export declare function diffPlans(before: PlanDocument, after: PlanDocument): PlanDiff;
//# sourceMappingURL=diff-plans.d.ts.map