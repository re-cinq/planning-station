import type { Hocuspocus } from "@hocuspocus/server";
import type { Server } from "@hapi/hapi";
import { type PlanLifecycleHooks, type PlanningService } from "../core/planning-service.js";
import type { CollabAuthenticator } from "../ports/authenticator.js";
import type { PlanStore } from "../ports/plan-store.js";
import { type AgentWriter } from "../core/agent-writer.js";
import { type ServiceAuth } from "./routes.js";
export interface PlanningSyncOptions extends PlanLifecycleHooks {
    store: PlanStore;
    authenticator: CollabAuthenticator;
    prefix?: string;
    serviceAuth?: ServiceAuth;
    debounce?: number;
    maxDebounce?: number;
}
export interface PlanningSync {
    service: PlanningService;
    writer: AgentWriter;
    collab: Hocuspocus;
}
/** Mounts the plan routes and the collaboration socket on the host's hapi server. */
export declare function registerPlanningSync(server: Server, options: PlanningSyncOptions): PlanningSync;
//# sourceMappingURL=register.d.ts.map