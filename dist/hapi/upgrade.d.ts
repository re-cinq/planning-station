import type { Server as HttpServer } from "node:http";
import type { Hocuspocus } from "@hocuspocus/server";
export interface CollabMount {
    listener: HttpServer;
    collab: Hocuspocus;
    path: string;
}
/** Serves the collaboration socket on the host's own listener. */
export declare function mountCollab({ listener, collab, path }: CollabMount): void;
//# sourceMappingURL=upgrade.d.ts.map