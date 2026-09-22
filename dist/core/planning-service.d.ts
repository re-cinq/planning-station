import { type PlanMeta } from "@re-cinq/planning-document";
import { type Doc } from "yjs";
import type { NewPlan, PlanStore, PlanVersion, PlanVersionSummary, StoredProjection, VersionReason } from "../ports/plan-store.js";
export interface CreatedPlan {
    meta: PlanMeta;
    documentName: string;
}
export interface DocumentWrite {
    planId: string;
    doc: Doc;
    actor: string;
    reason: VersionReason;
}
export interface ApprovalRequest {
    planId: string;
    approvedBy: string;
}
/** What the host hears about a plan's workflow, after the store has it. */
export interface PlanLifecycleHooks {
    onApproved?(meta: PlanMeta): Promise<void>;
}
export interface PlanningService {
    createPlan(input: NewPlan): Promise<CreatedPlan>;
    readPlan(planId: string): Promise<StoredProjection>;
    loadState(planId: string): Promise<Uint8Array | null>;
    storeDocument(write: DocumentWrite): Promise<void>;
    approvePlan(request: ApprovalRequest): Promise<PlanMeta>;
    reopenPlan(planId: string): Promise<PlanMeta>;
    listVersions(planId: string): Promise<PlanVersionSummary[]>;
    getVersion(planId: string, number: number): Promise<PlanVersion>;
}
export declare function createPlanningService(store: PlanStore, hooks?: PlanLifecycleHooks): PlanningService;
//# sourceMappingURL=planning-service.d.ts.map