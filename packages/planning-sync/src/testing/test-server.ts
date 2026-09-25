import Hapi from "@hapi/hapi";
import type { Hocuspocus } from "@hocuspocus/server";

import type { AgentWriter } from "../core/agent-writer.js";
import type {
  PlanLifecycleHooks,
  PlanningService,
} from "../core/planning-service.js";
import { registerPlanningSync } from "../hapi/register.js";
import type { ServiceAuth } from "../hapi/routes.js";
import { createMemoryPlanStore } from "../memory/memory-plan-store.js";
import type { CollabAuthenticator, PlanRole } from "../ports/authenticator.js";
import type { PlanStore } from "../ports/plan-store.js";

export interface TestServer {
  url: string;
  wsUrl: string;
  service: PlanningService;
  writer: AgentWriter;
  store: PlanStore;
  collab: Hocuspocus;
  close(): Promise<void>;
}

export interface TestServerOptions extends PlanLifecycleHooks {
  store?: PlanStore;
  authenticator?: CollabAuthenticator;
  serviceAuth?: ServiceAuth;
  debounce?: number;
}

/** A hapi server on a free port with the planning library registered. */
export async function startTestServer(
  options: TestServerOptions = {},
): Promise<TestServer> {
  const store = options.store ?? createMemoryPlanStore();
  const server = Hapi.server({ port: 0, host: "127.0.0.1" });
  const { service, writer, collab } = registerPlanningSync(server, {
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
    collab,
    close: () => server.stop(),
  };
}

function urlsOf(uri: string) {
  return { url: uri, wsUrl: `${uri.replace("http", "ws")}/api/plans/collab` };
}

/** Accepts tokens of the form "ana" or "ana:read"; anything else is refused. */
export function nameTokenAuthenticator(): CollabAuthenticator {
  return {
    authenticate: async (token) => {
      const [name, role] = token.split(":");

      return name ? { id: name, name, role: asRole(role) } : null;
    },
  };
}

function asRole(role: string | undefined): PlanRole {
  return role === "read" ? "read" : "write";
}
