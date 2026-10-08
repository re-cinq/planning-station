import { enforceTrue } from "@re-cinq/planning-document";
export class UnknownPlanError extends Error {
}
/** A PlanStore that keeps everything in this process; the PoC and tests use it. */
export function createMemoryPlanStore() {
    const rows = new Map();
    return {
        createPlan: async (input) => addPlan(rows, input),
        getMeta: async (planId) => rows.get(planId)?.meta ?? null,
        updateMeta: async (planId, patch) => patchMeta(rows, planId, patch),
        loadState: async (planId) => storedOf(rows, planId)?.state ?? null,
        storeState: async (input) => {
            row(rows, input.planId).stored = input;
        },
        loadProjection: async (planId) => projectionOf(rows.get(planId)),
        appendVersion: async (version) => {
            row(rows, version.planId).versions.push(version);
        },
        listVersions: async (planId) => row(rows, planId).versions.map(summaryOf),
        getVersion: async (planId, number) => row(rows, planId).versions.find((version) => version.number === number) ??
            null,
    };
}
function storedOf(rows, planId) {
    return rows.get(planId)?.stored ?? null;
}
function row(rows, planId) {
    const found = rows.get(planId);
    enforceTrue(found, UnknownPlanError, `unknown plan ${planId}`);
    return found;
}
function addPlan(rows, input) {
    const meta = {
        schemaVersion: 1,
        id: globalThis.crypto.randomUUID(),
        repo: input.repo,
        type: input.type,
        templateVersion: 1,
        title: input.title,
        status: "draft",
        approval: null,
        version: 0,
        createdBy: input.createdBy,
        updatedAt: new Date().toISOString(),
    };
    rows.set(meta.id, { meta, stored: null, versions: [] });
    return meta;
}
function patchMeta(rows, planId, patch) {
    const found = row(rows, planId);
    found.meta = { ...found.meta, ...patch, updatedAt: new Date().toISOString() };
    return found.meta;
}
function projectionOf(found) {
    const stored = found?.stored;
    return stored
        ? {
            json: stored.json,
            contentHash: stored.contentHash,
            version: found.meta.version,
        }
        : null;
}
function summaryOf(version) {
    return {
        planId: version.planId,
        number: version.number,
        reason: version.reason,
        createdBy: version.createdBy,
        createdAt: version.createdAt,
        contentHash: version.contentHash,
    };
}
//# sourceMappingURL=memory-plan-store.js.map