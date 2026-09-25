import type { Document, Hocuspocus } from "@hocuspocus/server";
import { type PlanMeta } from "@re-cinq/planning-document";
/** A server-side connection to one plan's live document. */
export type PlanConnection = Awaited<ReturnType<Hocuspocus["openDirectConnection"]>>;
export declare function openPlanConnection(collab: Hocuspocus, meta: PlanMeta): Promise<PlanConnection>;
/** Runs the work in one transaction on the live document and answers what it returned. */
export declare function transactOn<Result>(connection: PlanConnection, work: (document: Document) => Result): Promise<Result>;
//# sourceMappingURL=plan-connection.d.ts.map