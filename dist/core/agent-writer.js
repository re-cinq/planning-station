import { blockHash, enforceTrue, SectionChangedError, toPlanDocument, } from "@re-cinq/planning-document";
import { applyOpsToDoc, enforceSectionUnchanged, failRefine, finishRefine, proposeChanges, proposePass, proposeRefine, readBlocks, } from "@re-cinq/planning-yjs";
import { createAgentPresence, } from "./agent-presence.js";
import { openPlanConnection, transactOn } from "./plan-connection.js";
export const AGENT_ORIGIN = "planning-agent";
export function createAgentWriter(options) {
    const presence = createAgentPresence(options);
    return {
        applyOps: (request) => write({ ...options, presence }, request),
        propose: (request) => propose(options, request),
        proposePass: (request) => pass(options, request),
        proposeChanges: (request) => changes(options, request),
        failRefine: (request) => fail(options, request),
        finishRefine: (request) => finish(options, request),
        openPresence: (request) => presence.open(request),
        setEditing: (request) => presence.setEditing(request),
        closePresence: (request) => presence.close(request),
    };
}
async function write(context, request) {
    const { json } = await context.service.readPlan(request.planId);
    const blocks = await inHeldOrFreshDocument(context, json, (document) => {
        enforceBase(document, request.base);
        enforceBlock(document, request.expect);
        return applyOpsToDoc(document, request.ops, AGENT_ORIGIN);
    });
    return toPlanDocument(blocks, json);
}
async function propose(options, { planId, actor, ...offer }) {
    const { json } = await options.service.readPlan(planId);
    return inDocument(options, json, (document) => proposeRefine(document, { ...offer, proposedBy: actor }, AGENT_ORIGIN));
}
async function pass(options, { planId, actor, ...offer }) {
    const { json } = await options.service.readPlan(planId);
    return inDocument(options, json, (document) => proposePass(document, { ...offer, proposedBy: actor }, AGENT_ORIGIN));
}
async function changes(options, { planId, actor, asked, ops, uses }) {
    const { json } = await options.service.readPlan(planId);
    return inDocument(options, json, (document) => proposeChanges(document, { slot: asked?.slot ?? "", ops, uses, proposedBy: actor }, AGENT_ORIGIN));
}
async function fail(options, { planId, ...failure }) {
    const { json } = await options.service.readPlan(planId);
    return inDocument(options, json, (document) => failRefine(document, failure, AGENT_ORIGIN));
}
async function finish(options, { planId, ...request }) {
    const { json } = await options.service.readPlan(planId);
    await inDocument(options, json, (document) => finishRefine(document, request, AGENT_ORIGIN));
}
function enforceBase(document, base) {
    if (base) {
        enforceSectionUnchanged(document, base);
    }
}
function enforceBlock(document, expect) {
    if (!expect)
        return;
    enforceTrue(blockHash(readBlocks(document), expect.blockId) === expect.hash, SectionChangedError, `block ${expect.blockId} changed after the agent read it`);
}
async function inHeldOrFreshDocument(context, meta, work) {
    const held = context.presence.heldConnection(meta.id);
    return held ? transactOn(held, work) : inDocument(context, meta, work);
}
async function inDocument(options, meta, work) {
    const connection = await openPlanConnection(options.collab, meta);
    try {
        return await transactOn(connection, work);
    }
    finally {
        await connection.disconnect();
    }
}
//# sourceMappingURL=agent-writer.js.map