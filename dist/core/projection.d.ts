import { type PlanDocument, type PlanMeta } from "@re-cinq/planning-document";
import type { Doc } from "yjs";
export declare function projectPlan(doc: Doc, meta: PlanMeta): PlanDocument;
/** Hashes the written content only, so workflow changes cut no content version. */
export declare function contentHash(plan: PlanDocument): string;
//# sourceMappingURL=projection.d.ts.map