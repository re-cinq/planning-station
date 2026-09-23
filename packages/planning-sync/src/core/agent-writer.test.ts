import { afterEach, describe, it, expect } from "vitest";
import type { AgentOp, PlanDocument } from "@re-cinq/planning-document";
import {
  readyFeature,
  writtenBlocks,
} from "@re-cinq/planning-document/testing";
import { askRefine, docFromBlocks, proposalsIn } from "@re-cinq/planning-yjs";
import { applyUpdate, Doc } from "yjs";

import { startTestServer, type TestServer } from "../testing/test-server.js";

const NEW_PLAN = {
  repo: "acme/shop",
  title: "Faster checkout",
  type: "feature" as const,
  createdBy: "octocat",
};

const INTENT: AgentOp = {
  op: "set-section-text",
  slot: "intent",
  paragraphs: ["Checkout is slow on mobile."],
};

const writtenIntent = (plan: PlanDocument) => {
  const intent = plan.sections.find((section) => section.slot === "intent");

  return writtenBlocks(intent?.blocks);
};

let running: TestServer | undefined;

const startPlan = async (doc = docFromBlocks(readyFeature())) => {
  running = await startTestServer({ debounce: 10 });
  const { meta } = await running.service.createPlan(NEW_PLAN);
  await running.service.storeDocument({
    planId: meta.id,
    doc,
    actor: "ana",
    reason: "publish",
  });

  return { test: running, planId: meta.id };
};

afterEach(async () => {
  await running?.close();
  running = undefined;
});

describe("createAgentWriter", () => {
  it("writes the agent's paragraph into the plan's intent", async () => {
    const { test, planId } = await startPlan();
    const plan = await test.writer.applyOps({
      planId,
      actor: "planning-agent",
      ops: [INTENT],
    });
    expect(writtenIntent(plan)).toHaveLength(1);
  });

  it("keeps the agent's write, so the next reader sees it", async () => {
    const { test, planId } = await startPlan();
    await test.writer.applyOps({
      planId,
      actor: "planning-agent",
      ops: [INTENT],
    });
    const { json } = await test.service.readPlan(planId);
    expect(writtenIntent(json)).toHaveLength(1);
  });

  it("leaves the plan's workflow status alone when it writes", async () => {
    const { test, planId } = await startPlan();
    await test.writer.applyOps({
      planId,
      actor: "planning-agent",
      ops: [INTENT],
    });
    expect(await test.store.getMeta(planId)).toMatchObject({ status: "draft" });
  });

  it("fails the Refine ana asked for the intent, and the next reader sees why", async () => {
    const asked = docFromBlocks(readyFeature());
    askRefine(asked, { slot: "intent", askedBy: "ana" });
    const { test, planId } = await startPlan(asked);
    await test.writer.failRefine({ planId, slot: "intent", reason: CRASHED });
    const reloaded = new Doc();
    applyUpdate(reloaded, (await test.service.loadState(planId)) ?? NO_STATE);
    expect(proposalsIn(reloaded)).toMatchObject([
      { status: "failed", slot: "intent", askedBy: "ana", reason: CRASHED },
    ]);
  });

  it("returns nothing when nobody asked to refine the intent", async () => {
    const { test, planId } = await startPlan();
    expect(
      await test.writer.failRefine({ planId, slot: "intent", reason: CRASHED }),
    ).toBeUndefined();
  });
});

const CRASHED = "the agent crashed before its first turn";
const NO_STATE = new Uint8Array();
