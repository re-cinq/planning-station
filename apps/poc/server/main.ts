import Hapi from "@hapi/hapi";
import { docFromBlocks } from "@re-cinq/planning-yjs";
import { registerPlanningSync } from "@re-cinq/planning-sync/hapi";
import { createMemoryPlanStore } from "@re-cinq/planning-sync/memory";

import type { BlockJson } from "@re-cinq/planning-document";

import {
  SAMPLE_BLOCKS,
  SAMPLE_TITLE,
  UNDRAWN_BLOCKS,
} from "../src/sample-plan.js";
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

async function publish(blocks: BlockJson[]) {
  const created = await service.createPlan({
    repo: "acme/shop",
    title: SAMPLE_TITLE,
    type: "feature",
    createdBy: "octocat",
  });
  await service.storeDocument({
    planId: created.meta.id,
    doc: docFromBlocks(blocks),
    actor: "octocat",
    reason: "publish",
  });

  return created;
}

// `?sample=undrawn` serves the plan whose Prototype section is empty, to see Generate prototype.
const SAMPLES = {
  sketched: await publish(SAMPLE_BLOCKS),
  undrawn: await publish(UNDRAWN_BLOCKS),
};

server.route({
  method: "GET",
  path: "/dev/plan",
  handler: async (request) => {
    const { meta, documentName } =
      request.query["sample"] === "undrawn"
        ? SAMPLES.undrawn
        : SAMPLES.sketched;

    return {
      documentName,
      meta: (await service.readPlan(meta.id)).json,
      wsUrl: `ws://localhost:${PORT}/api/plans/collab`,
      apiUrl: `http://localhost:${PORT}/api/plans`,
    };
  },
});

await server.start();
process.stdout.write(`planning-sync listening on ${server.info.uri}\n`);
