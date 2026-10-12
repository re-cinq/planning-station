import Hapi from "@hapi/hapi";
import { docName } from "@re-cinq/planning-document";
import { registerPlanningSync } from "../hapi/register.js";
import { createMemoryPlanStore } from "../memory/memory-plan-store.js";
/** A hapi server on a free port with the planning library registered. */
export async function startTestServer(options = {}) {
    const store = options.store ?? createMemoryPlanStore();
    const server = Hapi.server({ port: 0, host: "127.0.0.1" });
    const planning = registerPlanningSync(server, {
        ...options,
        store,
        authenticator: options.authenticator ?? nameTokenAuthenticator(),
        maxDebounce: options.debounce,
    });
    await server.start();
    return {
        ...urlsOf(server.info.uri),
        ...planning,
        store,
        close: () => server.stop(),
    };
}
function urlsOf(uri) {
    return { url: uri, wsUrl: `${uri.replace("http", "ws")}/api/plans/collab` };
}
/** Accepts tokens of the form "ana" or "ana:read"; anything else is refused. */
export function nameTokenAuthenticator() {
    return {
        authenticate: async (token) => {
            const [name, role] = token.split(":");
            return name ? { id: name, name, role: asRole(role) } : null;
        },
    };
}
function asRole(role) {
    return role === "read" ? "read" : "write";
}
/** Who the live document for one plan is showing as present, as each viewer broadcast it. */
export function presenceStates(collab, plan) {
    const document = collab.documents.get(docName(plan));
    const states = document?.awareness.getStates();
    return [...(states?.values() ?? [])];
}
//# sourceMappingURL=test-server.js.map