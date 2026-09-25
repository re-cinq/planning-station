import type { Hocuspocus } from "@hocuspocus/server";
import { type PlanConnection } from "./plan-connection.js";
import type { PlanningService } from "./planning-service.js";
export interface PresenceUser {
    name: string;
    color: string;
}
export interface PresenceRequest {
    planId: string;
    user: PresenceUser;
}
export interface EditingRequest {
    planId: string;
    slot: string | null;
}
export interface PresenceOptions {
    service: PlanningService;
    collab: Hocuspocus;
}
/** The agent shown on a plan to every viewer, over one connection it holds open until it leaves. */
export interface AgentPresence {
    open(request: PresenceRequest): Promise<void>;
    setEditing(request: EditingRequest): Promise<void>;
    close(request: {
        planId: string;
    }): Promise<void>;
    /** The connection the agent holds on the plan, while it is present there. */
    heldConnection(planId: string): PlanConnection | undefined;
}
export declare function createAgentPresence(options: PresenceOptions): AgentPresence;
//# sourceMappingURL=agent-presence.d.ts.map