import { createHash } from "node:crypto";
import { toPlanDocument, } from "@re-cinq/planning-document";
import { readBlocks } from "@re-cinq/planning-yjs";
export function projectPlan(doc, meta) {
    return toPlanDocument(readBlocks(doc), meta);
}
/** Hashes the written content only, so workflow changes cut no content version. */
export function contentHash(plan) {
    return createHash("sha256")
        .update(JSON.stringify(plan.sections))
        .digest("hex");
}
//# sourceMappingURL=projection.js.map