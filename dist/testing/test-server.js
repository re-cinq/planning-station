import Hapi from "@hapi/hapi";
import { registerPlanningSync } from "../hapi/register.js";
import { createMemoryPlanStore } from "../memory/memory-plan-store.js";
/** A hapi server on a free port with the planning library registered. */
export async function startTestServer(options = {}) {
    const store = options.store ?? createMemoryPlanStore();
    const server = Hapi.server({ port: 0, host: "127.0.0.1" });
    const { service, writer } = registerPlanningSync(server, {
        ...options,
        store,
        authenticator: options.authenticator ?? nameTokenAuthenticator(),
        maxDebounce: options.debounce,
    });
    await server.start();
    return {
        ...urlsOf(server.info.uri),
        service,
        writer,
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
//# sourceMappingURL=test-server.js.map