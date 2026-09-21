import { createCollabServer } from "../core/collab-server.js";
import { createPlanningService, } from "../core/planning-service.js";
import { createAgentWriter } from "../core/agent-writer.js";
import { planningRoutes, } from "./routes.js";
import { mountCollab } from "./upgrade.js";
const DEFAULT_PREFIX = "/api/plans";
/** Mounts the plan routes and the collaboration socket on the host's hapi server. */
export function registerPlanningSync(server, options) {
    const prefix = options.prefix ?? DEFAULT_PREFIX;
    const service = createPlanningService(options.store, options);
    const collab = createCollabServer({ ...options, service });
    const writer = createAgentWriter({ service, collab });
    server.route(routesFor({ service, writer }, prefix, options.serviceAuth));
    mountCollab({ listener: server.listener, collab, path: `${prefix}/collab` });
    server.ext("onPreStop", () => shutDown(collab));
    return { service, writer, collab };
}
function routesFor(api, prefix, serviceAuth = () => true) {
    return planningRoutes({ api, prefix, serviceAuth });
}
/** Writes out what is still debounced before the host's process goes away. */
function shutDown(collab) {
    collab.flushPendingStores();
    collab.closeConnections();
}
//# sourceMappingURL=register.js.map