import { createHash } from "node:crypto";
import {
  toPlanDocument,
  type PlanDocument,
  type PlanMeta,
} from "@re-cinq/planning-document";
import { readBlocks } from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

export function projectPlan(doc: Doc, meta: PlanMeta): PlanDocument {
  return toPlanDocument(readBlocks(doc), meta);
}

/** Hashes the written content only, so workflow changes cut no content version. */
export function contentHash(plan: PlanDocument): string {
  return createHash("sha256")
    .update(JSON.stringify(plan.sections))
    .digest("hex");
}
