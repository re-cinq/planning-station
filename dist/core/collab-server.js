import { enforceTrue, parseDocName, } from "@re-cinq/planning-document";
import { Hocuspocus, } from "@hocuspocus/server";
import { applyUpdate } from "yjs";
import { PlanNotFoundError } from "./errors.js";
export class CollabDeniedError extends Error {
}
const AGENT_ACTOR = "planning-agent";
const DEBOUNCE_MS = 2000;
const MAX_DEBOUNCE_MS = 10000;
/** The Yjs server: it authenticates, loads and persists the plan document. */
export function createCollabServer(options) {
    return new Hocuspocus({
        quiet: true,
        debounce: options.debounce ?? DEBOUNCE_MS,
        maxDebounce: options.maxDebounce ?? MAX_DEBOUNCE_MS,
        onAuthenticate: (payload) => authenticate(options, payload),
        onLoadDocument: (payload) => loadDocument(options.service, payload),
        onStoreDocument: (payload) => storeDocument(options.service, payload),
    });
}
async function authenticate(options, payload) {
    const plan = parseDocName(payload.documentName);
    const user = await options.authenticator.authenticate(payload.token, plan);
    enforceTrue(user, CollabDeniedError, `no access to plan ${plan.planId} in ${plan.repo}`);
    const meta = await options.service.readPlan(plan.planId);
    payload.connectionConfig.readOnly =
        user.role === "read" || meta.json.status === "approved";
    return { user, plan };
}
async function loadDocument(service, payload) {
    const { planId } = parseDocName(payload.documentName);
    const state = await service.loadState(planId);
    enforceTrue(state, PlanNotFoundError, `plan ${planId} has no document`);
    applyUpdate(payload.document, state);
}
async function storeDocument(service, payload) {
    const { planId } = parseDocName(payload.documentName);
    const actor = actorOf(payload.lastContext);
    await service.storeDocument({
        planId,
        doc: payload.document,
        actor,
        reason: actor === AGENT_ACTOR ? "agent-write" : "auto",
    });
}
/** A direct write by the agent carries no client context. */
function actorOf(context) {
    const { user } = context;
    return user ? user.id : AGENT_ACTOR;
}
//# sourceMappingURL=collab-server.js.map