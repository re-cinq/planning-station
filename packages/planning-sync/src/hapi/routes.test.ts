import { afterEach, describe, it, expect } from "vitest";
import { docFromBlocks } from "@re-cinq/planning-yjs";
import { enforceTrue } from "@re-cinq/planning-document";
import { readyFeature } from "@re-cinq/planning-document/testing";

import {
  presenceStates,
  startTestServer,
  type TestServer,
} from "../testing/test-server.js";

const NEW_PLAN = {
  repo: "acme/shop",
  title: "Faster checkout",
  type: "feature",
  createdBy: "octocat",
};

const TIMEOUT_MS = 5000;

let running: TestServer | undefined;

const server = async (serviceAuth?: () => boolean) => {
  running = await startTestServer({ serviceAuth });

  return running;
};

const call = async (test: TestServer, path: string, payload?: object) => {
  const response = await fetch(`${test.url}/api/plans${path}`, {
    method: payload ? "POST" : "GET",
    headers: { "content-type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  return { status: response.status, body: await response.json() };
};

const createdPlan = async (test: TestServer) => {
  const created = await call(test, "", NEW_PLAN);

  return String((created.body as { meta: { id: string } }).meta.id);
};

interface WireSection {
  slot: string;
  blocks: { type: string; props?: { used?: boolean } }[];
}

const sectionsOf = (body: unknown) =>
  (body as { sections: WireSection[] }).sections;

const sectionIn = (body: unknown, slot: string) => {
  const section = sectionsOf(body).find((candidate) => candidate.slot === slot);
  enforceTrue(section, Error, `no ${slot} section in the plan`);

  return section;
};

const readyPlan = async (test: TestServer) => {
  const planId = await createdPlan(test);
  await test.service.storeDocument({
    planId,
    doc: docFromBlocks(readyFeature()),
    actor: "ana",
    reason: "publish",
  });

  return planId;
};

afterEach(async () => {
  await running?.close();
  running = undefined;
});

describe("planningRoutes", () => {
  it("answers 201 with the plan's document name when a plan is created", async () => {
    const test = await server();
    const created = await call(test, "", NEW_PLAN);
    expect(created).toMatchObject({
      status: 201,
      body: { documentName: expect.stringContaining("plan:acme/shop:") },
    });
  });

  it("answers the seeded plan's sections on GET", async () => {
    const test = await server();
    const read = await call(test, `/${await createdPlan(test)}`);
    expect(read.body).toMatchObject({ version: 1, json: { status: "draft" } });
  });

  it("answers 404 with a plan-not-found problem for an unknown plan", async () => {
    const test = await server();
    expect(
      await call(test, "/8e3c1f0a-1b2c-4d3e-8f40-000000000000"),
    ).toMatchObject({
      status: 404,
      body: { type: "urn:planning:plan-not-found" },
    });
  });

  it("answers 409 with the empty sections when a seeded plan is approved", async () => {
    const test = await server();
    const planId = await createdPlan(test);
    const refused = await call(test, `/${planId}/approve`, {
      approvedBy: "ana",
    });
    expect(refused).toMatchObject({
      status: 409,
      body: { type: "urn:planning:plan-not-approvable" },
    });
  });

  it("approves a complete plan and answers its approval", async () => {
    const test = await server();
    const planId = await readyPlan(test);
    const approved = await call(test, `/${planId}/approve`, {
      approvedBy: "ana",
    });
    expect(approved.body).toMatchObject({
      status: "approved",
      approval: { approvedBy: "ana" },
    });
  });

  it("lists the versions written so far", async () => {
    const test = await server();
    const versions = await call(test, `/${await createdPlan(test)}/versions`);
    expect(versions.body).toMatchObject({
      versions: [{ number: 1, reason: "publish", createdBy: "octocat" }],
    });
  });

  it("answers 401 when the host's serviceAuth refuses the caller", async () => {
    const test = await server(() => false);
    expect(await call(test, "", NEW_PLAN)).toMatchObject({
      status: 401,
      body: { type: "urn:planning:unauthorized" },
    });
  });

  it("answers 400 when the payload is not a plan", async () => {
    const test = await server();
    expect(await call(test, "", { repo: "nope" })).toMatchObject({
      status: 400,
      body: { type: "urn:planning:invalid-request" },
    });
  });

  it("takes the agent's ops and answers the plan it wrote", async () => {
    const test = await server();
    const written = await call(
      test,
      `/${await createdPlan(test)}/agent-edits`,
      {
        actor: "planning-agent",
        ops: [
          { op: "set-section-text", slot: "intent", paragraphs: ["Too slow."] },
        ],
      },
    );
    expect(sectionsOf(written.body)[0]).toMatchObject({
      slot: "intent",
      blocks: [
        { type: "section-panel" },
        { type: "paragraph" },
        { type: "section-actions" },
      ],
    });
  });

  it("marks q-1 used after refine-done on intent", async () => {
    const test = await server();
    const planId = await createdPlan(test);
    await call(test, `/${planId}/agent-edits`, {
      actor: "planning-agent",
      ops: [
        {
          op: "add-question",
          slot: "intent",
          questionId: "q-1",
          question: "Who is this for?",
        },
      ],
    });
    const done = await call(test, `/${planId}/refine-done`, {
      slot: "intent",
      uses: { questions: ["q-1"], comments: [] },
    });
    const read = await call(test, `/${planId}`);
    const intent = sectionIn((read.body as { json: unknown }).json, "intent");
    const question = intent.blocks.find((block) => block.type === "question");
    expect({ status: done.status, used: question?.props?.used }).toEqual({
      status: 200,
      used: true,
    });
  });

  it("shows the agent editing intent after opening presence and setting the slot", async () => {
    const test = await server();
    const planId = await createdPlan(test);
    const user = { name: "Planning agent", color: "hsl(200 65% 45%)" };
    await call(test, `/${planId}/agent-presence`, { user });
    const editing = await call(test, `/${planId}/agent-editing`, {
      slot: "intent",
    });
    const states = presenceStates(test.collab, { repo: NEW_PLAN.repo, planId });
    expect({ status: editing.status, states }).toEqual({
      status: 200,
      states: [{ user, editing: { slot: "intent" } }],
    });
  });

  it("tells the host's onApproved which plan the route approved", async () => {
    const approved: string[] = [];
    running = await startTestServer({
      onApproved: async (meta) => void approved.push(meta.id),
    });
    const planId = await readyPlan(running);
    await call(running, `/${planId}/approve`, { approvedBy: "ana" });
    expect(approved).toEqual([planId]);
  });
});
