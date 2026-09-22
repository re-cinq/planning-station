import { type ParsedDocName } from "@re-cinq/planning-document";
import { Hocuspocus } from "@hocuspocus/server";
import type { CollabAuthenticator, Principal } from "../ports/authenticator.js";
import type { PlanningService } from "./planning-service.js";
export declare class CollabDeniedError extends Error {
}
export interface CollabContext {
    user: Principal;
    plan: ParsedDocName;
}
export interface CollabOptions {
    service: PlanningService;
    authenticator: CollabAuthenticator;
    debounce?: number;
    maxDebounce?: number;
}
/** The Yjs server: it authenticates, loads and persists the plan document. */
export declare function createCollabServer(options: CollabOptions): Hocuspocus;
//# sourceMappingURL=collab-server.d.ts.map