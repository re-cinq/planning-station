import Hapi from "@hapi/hapi";
import { docFromBlocks } from "@re-cinq/planning-yjs";
import { registerPlanningSync } from "@re-cinq/planning-sync/hapi";
import { createMemoryPlanStore } from "@re-cinq/planning-sync/memory";

import { SAMPLE_BLOCKS, SAMPLE_TITLE } from "../src/sample-plan.js";
import { devAuthenticator } from "./dev-authenticator.js";

const PORT = 1234;
const WEB_ORIGIN = "http://localhost:5173";

const server = Hapi.server({
  port: PORT,
  host: "127.0.0.1",
  routes: { cors: { origin: [WEB_ORIGIN] } },
});

const { service } = registerPlanningSync(server, {
  store: createMemoryPlanStore(),
  authenticator: devAuthenticator(),
  debounce: 200,
});

const { meta, documentName } = await service.createPlan({
  repo: "acme/shop",
  title: SAMPLE_TITLE,
  type: "feature",
  createdBy: "octocat",
});

await service.storeDocument({
  planId: meta.id,
  doc: docFromBlocks(SAMPLE_BLOCKS),
  actor: "octocat",
  reason: "publish",
});

server.route({
  method: "GET",
  path: "/dev/plan",
  handler: async () => ({
    documentName,
    meta: (await service.readPlan(meta.id)).json,
    wsUrl: `ws://localhost:${PORT}/api/plans/collab`,
    apiUrl: `http://localhost:${PORT}/api/plans`,
  }),
});

await server.start();
process.stdout.write(`planning-sync listening on ${server.info.uri}\n`);
