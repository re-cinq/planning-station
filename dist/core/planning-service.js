import { docName, enforceTrue, seedBlocks, templateFor, validatePlan, } from "@re-cinq/planning-document";
import { docFromBlocks } from "@re-cinq/planning-yjs";
import { encodeStateAsUpdate } from "yjs";
import { approvalError } from "./approval-error.js";
import { PlanNotFoundError } from "./errors.js";
import { contentHash, projectPlan } from "./projection.js";
export function createPlanningService(store, hooks = {}) {
    const service = {
        createPlan: (input) => createPlan(store, service, input),
        readPlan: (planId) => readPlan(store, planId),
        loadState: (planId) => store.loadState(planId),
        storeDocument: (write) => storeDocument(store, write),
        approvePlan: (request) => approvePlan(store, hooks, request),
        reopenPlan: (planId) => store.updateMeta(planId, { status: "draft", approval: null }),
        listVersions: (planId) => store.listVersions(planId),
        getVersion: (planId, number) => getVersion(store, planId, number),
    };
    return service;
}
async function createPlan(store, service, input) {
    const created = await store.createPlan(input);
    const doc = docFromBlocks(seedBlocks(templateFor(input.type), { title: input.title }));
    await service.storeDocument({
        planId: created.id,
        doc,
        actor: input.createdBy,
        reason: "publish",
    });
    return {
        meta: await metaOf(store, created.id),
        documentName: docName({ repo: created.repo, planId: created.id }),
    };
}
/** The stored JSON carries the meta of its write, so the current one wins. */
async function readPlan(store, planId) {
    const projection = await store.loadProjection(planId);
    enforceTrue(projection, PlanNotFoundError, `unknown plan ${planId}`);
    const meta = await metaOf(store, planId);
    return { ...projection, json: { ...projection.json, ...meta } };
}
async function storeDocument(store, write) {
    const meta = await metaOf(store, write.planId);
    const version = versionOf(meta, write);
    const previous = await store.loadProjection(meta.id);
    if (previous?.contentHash === version.contentHash) {
        // A Refine asked, proposed or discarded lives beside the content: keep it, mint no version.
        await store.storeState({
            ...previous,
            planId: meta.id,
            state: version.state,
        });
        return;
    }
    await store.storeState(version);
    await store.updateMeta(meta.id, { version: version.number });
    await store.appendVersion(version);
}
async function approvePlan(store, hooks, { planId, approvedBy }) {
    const { json, version } = await readPlan(store, planId);
    const report = validatePlan(json, "approval");
    enforceTrue(report.passed, approvalError(report), `plan ${planId} is not ready for approval`);
    const approved = await store.updateMeta(planId, {
        status: "approved",
        approval: approvalOf(approvedBy, version),
    });
    await hooks.onApproved?.(approved);
    return approved;
}
function approvalOf(approvedBy, version) {
    return {
        mode: "manual",
        approvedBy,
        approvedAt: new Date().toISOString(),
        version,
    };
}
async function getVersion(store, planId, number) {
    const version = await store.getVersion(planId, number);
    enforceTrue(version, PlanNotFoundError, `plan ${planId} has no version ${number}`);
    return version;
}
async function metaOf(store, planId) {
    const meta = await store.getMeta(planId);
    enforceTrue(meta, PlanNotFoundError, `unknown plan ${planId}`);
    return meta;
}
function versionOf(meta, write) {
    const number = meta.version + 1;
    const json = projectPlan(write.doc, { ...meta, version: number });
    return {
        planId: meta.id,
        number,
        reason: write.reason,
        createdBy: write.actor,
        createdAt: new Date().toISOString(),
        contentHash: contentHash(json),
        json,
        state: encodeStateAsUpdate(write.doc),
    };
}
//# sourceMappingURL=planning-service.js.map