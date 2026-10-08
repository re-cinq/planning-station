import { afterEach, describe, it, expect } from "vitest";
import {
  enforceTrue,
  inlineFromText,
  readView,
  SectionChangedError,
  type AgentOp,
  type PlanDocument,
  type ReadBlock,
} from "@re-cinq/planning-document";
import {
  readyFeature,
  writtenBlocks,
} from "@re-cinq/planning-document/testing";
import {
  askRefine,
  docFromBlocks,
  proposalsIn,
  readBlocks,
} from "@re-cinq/planning-yjs";
import { applyUpdate, Doc } from "yjs";

import { SectionNotRemovableError } from "./section-not-removable-error.js";
import {
  presenceStates,
  startTestServer,
  type TestServer,
} from "../testing/test-server.js";

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

const LONGER_THAN_ANY_TEST_MS = 60_000;

const startPlan = async (
  doc = docFromBlocks(readyFeature()),
  debounce = 10,
) => {
  running = await startTestServer({ debounce });
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

  it("refuses a per-block write when that block changed since the agent read it", async () => {
    const { test, planId } = await startPlan();
    await test.writer.applyOps({
      planId,
      actor: "planning-agent",
      ops: [INTENT],
    });
    const intentBlock = await firstIntentBlock(test, planId);
    await test.writer.applyOps({
      planId,
      actor: "ana",
      ops: [
        {
          op: "replace-block",
          slot: "intent",
          blockId: intentBlock.id,
          block: { type: "paragraph", content: inlineFromText("Ana's edit.") },
        },
      ],
    });

    await expect(
      test.writer.applyOps({
        planId,
        actor: "planning-agent",
        ops: [
          {
            op: "replace-block",
            slot: "intent",
            blockId: intentBlock.id,
            block: {
              type: "paragraph",
              content: inlineFromText("The agent's stale edit."),
            },
          },
        ],
        expect: { blockId: intentBlock.id, hash: intentBlock.hash },
      }),
    ).rejects.toThrow(SectionChangedError);
  });

  it("removes the feature prototype section and records it as dropped", async () => {
    const { test, planId } = await startPlan();
    const plan = await test.writer.applyOps({
      planId,
      actor: "planning-agent",
      ops: [{ op: "remove-section", slot: "prototype" }],
    });
    expect({
      prototype: plan.sections.some(({ slot }) => slot === "prototype"),
      droppedSlots: plan.droppedSlots,
    }).toEqual({ prototype: false, droppedSlots: ["prototype"] });
  });

  it("refuses to remove the always-required intent section, naming why", async () => {
    const { test, planId } = await startPlan();
    await expect(
      test.writer.applyOps({
        planId,
        actor: "planning-agent",
        ops: [{ op: "remove-section", slot: "intent" }],
      }),
    ).rejects.toThrow(
      new SectionNotRemovableError(
        "intent is always required in a feature plan, so it cannot be removed",
      ),
    );
  });

  it("refuses a proposed removal of the always-required kpis section", async () => {
    const { test, planId } = await startPlan();
    await expect(
      test.writer.proposeChanges({
        planId,
        actor: "planning-agent",
        ops: [{ op: "remove-section", slot: "kpis" }],
        uses: { questions: [], comments: [] },
      }),
    ).rejects.toThrow(
      new SectionNotRemovableError(
        "kpis is always required in a feature plan, so it cannot be removed",
      ),
    );
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

  it("writes one version for three ops made while presence is open", async () => {
    const { test, planId } = await startPlan(
      docFromBlocks(readyFeature()),
      LONGER_THAN_ANY_TEST_MS,
    );
    await test.writer.openPresence({ planId, user: AGENT_USER });

    const before = (await test.store.listVersions(planId)).length;

    for (const text of ["One.", "Two.", "Three."]) {
      await test.writer.applyOps({
        planId,
        actor: "planning-agent",
        ops: [{ op: "append-to-section", slot: "intent", paragraphs: [text] }],
      });
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    await test.writer.closePresence({ planId });

    const after = (await test.store.listVersions(planId)).length;
    expect(after - before).toEqual(1);
  });

  it("broadcasts the agent's name and color when it opens presence on the plan", async () => {
    const { test, planId } = await startPlan();
    await test.writer.openPresence({ planId, user: AGENT_USER });

    expect(
      presenceStates(test.collab, { repo: NEW_PLAN.repo, planId }),
    ).toEqual([{ user: AGENT_USER, editing: { slot: null } }]);
  });

  it("refuses a Refine proposal removing intent and a pass removing kpis, naming why", async () => {
    const { test, planId } = await startPlan();
    const request = { planId, actor: "planning-agent" };
    const uses = { questions: [], comments: [] };

    expect({
      proposal: await refusalOf(
        test.writer.propose({
          ...request,
          slot: "intent",
          baseHash: "any",
          uses,
          ops: [{ op: "remove-section", slot: "intent" }],
        }),
      ),
      pass: await refusalOf(
        test.writer.proposePass({
          ...request,
          uses,
          ops: [{ op: "remove-section", slot: "kpis" }],
        }),
      ),
    }).toEqual({
      proposal:
        "intent is always required in a feature plan, so it cannot be removed",
      pass: "kpis is always required in a feature plan, so it cannot be removed",
    });
  });
});

function refusalOf(write: Promise<unknown>): Promise<string> {
  return write.then(
    () => "accepted",
    (error: Error) => error.message,
  );
}

const CRASHED = "the agent crashed before its first turn";
const NO_STATE = new Uint8Array();
const AGENT_USER = { name: "Planning agent", color: "hsl(200 65% 45%)" };

async function firstIntentBlock(
  test: TestServer,
  planId: string,
): Promise<ReadBlock> {
  const reloaded = new Doc();
  applyUpdate(reloaded, (await test.service.loadState(planId)) ?? NO_STATE);
  const { sections } = readView(readBlocks(reloaded));
  const intent = sections.find((section) => section.slot === "intent");
  const [block] = intent?.blocks ?? [];
  enforceTrue(block, Error, "intent block missing from written plan");

  return block;
}
