import { toPlanDocument } from "@re-cinq/planning-document";
import { readyFeature } from "@re-cinq/planning-document/testing";
const NEW_PLAN = {
    repo: "acme/shop",
    title: "Faster checkout",
    type: "feature",
    createdBy: "octocat",
};
const HASH = "hash-1";
const STATE = Uint8Array.from("yjs", (letter) => letter.charCodeAt(0));
const FIRST_VERSION = 1;
const NO_SUCH_VERSION = 99;
/** Names everything a PlanStore got wrong, so a host can check its own one. */
export async function checkPlanStore(store) {
    const meta = await store.createPlan(NEW_PLAN);
    const version = versionOf(meta);
    await store.storeState(version);
    await store.appendVersion(version);
    return [
        ...(await checkMeta(store, meta)),
        ...(await checkState(store, meta)),
        ...(await checkVersions(store, meta)),
    ];
}
function versionOf(meta) {
    return {
        planId: meta.id,
        number: FIRST_VERSION,
        reason: "publish",
        createdBy: meta.createdBy,
        createdAt: meta.updatedAt,
        contentHash: HASH,
        json: toPlanDocument(readyFeature(), meta),
        state: STATE,
    };
}
async function checkMeta(store, meta) {
    const found = await store.getMeta(meta.id);
    const unknown = await store.getMeta("no-such-plan");
    const patched = await store.updateMeta(meta.id, {
        status: "approved",
        version: FIRST_VERSION,
    });
    return failures([
        { what: "createPlan gives a draft plan", holds: meta.status === "draft" },
        { what: "getMeta returns the created plan", holds: found?.id === meta.id },
        { what: "getMeta is null for an unknown plan", holds: unknown === null },
        {
            what: "updateMeta applies the patch",
            holds: patched.status === "approved",
        },
    ]);
}
async function checkState(store, meta) {
    const state = await store.loadState(meta.id);
    const projection = await store.loadProjection(meta.id);
    const kpis = projection?.json.kpis ?? [];
    return failures([
        {
            what: "loadState returns the stored update",
            holds: state?.length === STATE.length,
        },
        {
            what: "loadProjection returns the stored hash",
            holds: projection?.contentHash === HASH,
        },
        {
            what: "loadProjection returns the plan's KPIs",
            holds: kpis.length === 1,
        },
    ]);
}
async function checkVersions(store, meta) {
    const summaries = await store.listVersions(meta.id);
    const first = await store.getVersion(meta.id, FIRST_VERSION);
    const missing = await store.getVersion(meta.id, NO_SUCH_VERSION);
    const kpis = first?.json.kpis ?? [];
    return failures([
        { what: "listVersions lists the version", holds: summaries.length === 1 },
        { what: "getVersion returns its own plan", holds: kpis.length === 1 },
        { what: "getVersion is null when unknown", holds: missing === null },
    ]);
}
function failures(checks) {
    return checks.filter((check) => !check.holds).map((check) => check.what);
}
//# sourceMappingURL=plan-store-check.js.map