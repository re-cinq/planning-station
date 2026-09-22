import type { Request, ServerRoute } from "@hapi/hapi";
import type { AgentWriter } from "../core/agent-writer.js";
import type { PlanningService } from "../core/planning-service.js";
export type ServiceAuth = (request: Request) => boolean;
export interface PlanningApi {
    service: PlanningService;
    writer: AgentWriter;
}
export interface RouteOptions {
    api: PlanningApi;
    prefix: string;
    serviceAuth: ServiceAuth;
}
export declare function planningRoutes(options: RouteOptions): ServerRoute[];
//# sourceMappingURL=routes.d.ts.map