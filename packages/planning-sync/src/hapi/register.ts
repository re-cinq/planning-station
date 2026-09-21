import type { Hocuspocus } from "@hocuspocus/server";
import type { Server } from "@hapi/hapi";

import { createCollabServer } from "../core/collab-server.js";
import {
  createPlanningService,
  type PlanningService,
} from "../core/planning-service.js";
import type { CollabAuthenticator } from "../ports/authenticator.js";
import type { PlanStore } from "../ports/plan-store.js";
import { createAgentWriter, type AgentWriter } from "../core/agent-writer.js";
import {
  planningRoutes,
  type PlanningApi,
  type ServiceAuth,
} from "./routes.js";
import { mountCollab } from "./upgrade.js";

export interface PlanningSyncOptions {
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

const DEFAULT_PREFIX = "/api/plans";

/** Mounts the plan routes and the collaboration socket on the host's hapi server. */
export function registerPlanningSync(
  server: Server,
  options: PlanningSyncOptions,
): PlanningSync {
  const prefix = options.prefix ?? DEFAULT_PREFIX;
  const service = createPlanningService(options.store);
  const collab = createCollabServer({ ...options, service });
  const writer = createAgentWriter({ service, collab });
  server.route(routesFor({ service, writer }, prefix, options.serviceAuth));
  mountCollab({ listener: server.listener, collab, path: `${prefix}/collab` });
  server.ext("onPreStop", () => shutDown(collab));

  return { service, writer, collab };
}

function routesFor(
  api: PlanningApi,
  prefix: string,
  serviceAuth: ServiceAuth = () => true,
) {
  return planningRoutes({ api, prefix, serviceAuth });
}

/** Writes out what is still debounced before the host's process goes away. */
function shutDown(collab: Hocuspocus): void {
  collab.flushPendingStores();
  collab.closeConnections();
}
