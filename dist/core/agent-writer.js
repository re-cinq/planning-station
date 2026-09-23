import { docName, toPlanDocument, } from "@re-cinq/planning-document";
import { applyOpsToDoc, enforceSectionUnchanged, proposeChanges, proposePass, proposeRefine, } from "@re-cinq/planning-yjs";
export const AGENT_ORIGIN = "planning-agent";
export function createAgentWriter(options) {
    return {
        applyOps: (request) => write(options, request),
        propose: (request) => propose(options, request),
        proposePass: (request) => pass(options, request),
        proposeChanges: (request) => changes(options, request),
    };
}
async function write(options, request) {
    const { json } = await options.service.readPlan(request.planId);
    const blocks = await inDocument(options, json, (document) => {
        enforceBase(document, request.base);
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
function enforceBase(document, base) {
    if (base) {
        enforceSectionUnchanged(document, base);
    }
}
async function inDocument(options, meta, work) {
    const name = docName({ repo: meta.repo, planId: meta.id });
    const connection = await options.collab.openDirectConnection(name);
    const results = [];
    try {
        await connection.transact((document) => results.push(work(document)));
    }
    finally {
        await connection.disconnect();
    }
    return results[0];
}
//# sourceMappingURL=agent-writer.js.map