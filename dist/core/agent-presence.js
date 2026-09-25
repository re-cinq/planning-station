import { enforceTrue } from "@re-cinq/planning-document";
import { openPlanConnection } from "./plan-connection.js";
export function createAgentPresence(options) {
    const presences = new Map();
    return {
        open: (request) => open(options, presences, request),
        setEditing: async (request) => setEditing(presences, request),
        close: (request) => close(presences, request.planId),
        heldConnection: (planId) => presences.get(planId)?.connection,
    };
}
async function open(options, presences, { planId, user }) {
    const { json } = await options.service.readPlan(planId);
    const connection = await openPlanConnection(options.collab, json);
    const document = connection.document;
    enforceTrue(document !== null, Error, `no document to broadcast presence on for plan ${planId}`);
    presences.set(planId, { connection, awareness: document.awareness });
    document.awareness.setLocalState({ user, editing: { slot: null } });
}
function setEditing(presences, { planId, slot }) {
    const held = presences.get(planId);
    held?.awareness.setLocalStateField("editing", { slot });
}
async function close(presences, planId) {
    const held = presences.get(planId);
    if (!held)
        return;
    held.awareness.setLocalState(null);
    await held.connection.disconnect();
    presences.delete(planId);
}
//# sourceMappingURL=agent-presence.js.map