import { afterEach, describe, it, expect } from "vitest";
import {
  sectionHash,
  toBlocks,
  type PlanDocument,
} from "@re-cinq/planning-document";

import { startTestServer, type TestServer } from "../testing/test-server.js";

const TIMEOUT_MS = 5000;

const OUT_OF_SCOPE = {
  op: "append-to-section",
  slot: "scope",
  paragraphs: ["Out: the payment provider's page."],
};

let running: TestServer | undefined;

afterEach(async () => {
  await running?.close();
  running = undefined;
});

const post = async (path: string, payload: object) => {
  const response = await fetch(`${running?.url}/api/plans${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  return { status: response.status, body: await response.json() };
};

const newPlan = async () => {
  running = await startTestServer();
  const created = await post("", {
    repo: "acme/shop",
    title: "Faster checkout",
    type: "feature",
    createdBy: "ana",
  });
  const { meta } = created.body as { meta: { id: string } };
  const planId = meta.id;
  const { json } = await running.service.readPlan(planId);

  return { planId, scopeHash: sectionHash(toBlocks(json), "scope") };
};

const scopeOf = ({ sections }: PlanDocument) =>
  sections.find((section) => section.slot === "scope")?.blocks;

describe("POST /api/plans/:id/proposals", () => {
  it("answers 201 with the agent's proposal for scope, asked for by the agent when no person asked", async () => {
    const { planId, scopeHash } = await newPlan();
    const proposal = await post(`/${planId}/proposals`, {
      actor: "planning-agent",
      slot: "scope",
      baseHash: scopeHash,
      ops: [OUT_OF_SCOPE],
      uses: { questions: ["q-tax"] },
    });
    expect(proposal).toMatchObject({
      status: 201,
      body: {
        status: "proposed",
        askedBy: "planning-agent",
        uses: { questions: ["q-tax"], comments: [] },
      },
    });
  });

  it("answers 400 when a proposal for scope changes the intent", async () => {
    const { planId, scopeHash } = await newPlan();
    const refused = await post(`/${planId}/proposals`, {
      actor: "planning-agent",
      slot: "scope",
      baseHash: scopeHash,
      ops: [{ ...OUT_OF_SCOPE, slot: "intent" }],
    });
    expect(refused).toMatchObject({
      status: 400,
      body: { type: "urn:planning:invalid-request" },
    });
  });
});

describe("POST /api/plans/:id/agent-edits with a base", () => {
  it("writes the paragraph when scope still has the hash the agent read", async () => {
    const { planId, scopeHash } = await newPlan();
    const written = await post(`/${planId}/agent-edits`, {
      actor: "planning-agent",
      ops: [OUT_OF_SCOPE],
      base: { slot: "scope", hash: scopeHash },
    });
    expect(scopeOf(written.body)).toContainEqual(
      expect.objectContaining({ type: "paragraph" }),
    );
  });

  it("answers 409 section-changed when scope changed after the agent read it", async () => {
    const { planId } = await newPlan();
    const refused = await post(`/${planId}/agent-edits`, {
      actor: "planning-agent",
      ops: [OUT_OF_SCOPE],
      base: { slot: "scope", hash: "0" },
    });
    expect(refused).toMatchObject({
      status: 409,
      body: { type: "urn:planning:section-changed" },
    });
  });
});
