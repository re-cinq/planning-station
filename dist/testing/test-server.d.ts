import type { AgentWriter } from "../core/agent-writer.js";
import type { PlanLifecycleHooks, PlanningService } from "../core/planning-service.js";
import type { ServiceAuth } from "../hapi/routes.js";
import type { CollabAuthenticator } from "../ports/authenticator.js";
import type { PlanStore } from "../ports/plan-store.js";
export interface TestServer {
    url: string;
    wsUrl: string;
    service: PlanningService;
    writer: AgentWriter;
    store: PlanStore;
    close(): Promise<void>;
}
export interface TestServerOptions extends PlanLifecycleHooks {
    store?: PlanStore;
    authenticator?: CollabAuthenticator;
    serviceAuth?: ServiceAuth;
    debounce?: number;
}
/** A hapi server on a free port with the planning library registered. */
export declare function startTestServer(options?: TestServerOptions): Promise<TestServer>;
/** Accepts tokens of the form "ana" or "ana:read"; anything else is refused. */
export declare function nameTokenAuthenticator(): CollabAuthenticator;
//# sourceMappingURL=test-server.d.ts.map