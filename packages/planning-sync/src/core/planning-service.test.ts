import { describe, it, expect } from "vitest";
import { readyFeature } from "@re-cinq/planning-document/testing";
import { docFromBlocks } from "@re-cinq/planning-yjs";
import { applyUpdate, Doc } from "yjs";

import { createMemoryPlanStore } from "../memory/memory-plan-store.js";
import type { NewPlan } from "../ports/plan-store.js";
import { PlanNotApprovableError } from "./approval-error.js";
import { PlanNotFoundError } from "./errors.js";
import {
  createPlanningService,
  type PlanningService,
} from "./planning-service.js";

const NEW_PLAN: NewPlan = {
  repo: "acme/shop",
  title: "Faster checkout",
  type: "feature",
  createdBy: "octocat",
};

const service = () => createPlanningService(createMemoryPlanStore());

const liveDoc = async (plans: PlanningService, planId: string) => {
  const doc = new Doc();
  const state = await plans.loadState(planId);
  applyUpdate(doc, state ?? new Uint8Array());

  return doc;
};

const readyPlan = async () => {
  const plans = service();
  const { meta } = await plans.createPlan(NEW_PLAN);
  await plans.storeDocument({
    planId: meta.id,
    doc: docFromBlocks(readyFeature()),
    actor: "ana",
    reason: "publish",
  });

  return { plans, planId: meta.id };
};

describe("createPlanningService", () => {
  it("creates a draft feature plan at version 1", async () => {
    const { meta } = await service().createPlan(NEW_PLAN);
    expect(meta).toMatchObject({
      status: "draft",
      version: 1,
      type: "feature",
    });
  });

  it("names the new document plan:acme/shop:<plan id>", async () => {
    const created = await service().createPlan(NEW_PLAN);
    expect(created.documentName).toEqual(`plan:acme/shop:${created.meta.id}`);
  });

  it("seeds the new plan with the feature template's sections", async () => {
    const plans = service();
    const { meta } = await plans.createPlan(NEW_PLAN);
    const { json } = await plans.readPlan(meta.id);
    expect(json.sections.map((section) => section.slot)).toEqual([
      "intent",
      "kpis",
      "scope",
      "prototype",
      "constraints",
      "ownership",
      "delivery",
      "questions",
    ]);
  });

  it("throws PlanNotFoundError when reading a plan nobody created", async () => {
    await expect(service().readPlan("nope")).rejects.toThrow(PlanNotFoundError);
  });

  it("stores the written document as version 2 with its KPI", async () => {
    const { plans, planId } = await readyPlan();
    const { json, version } = await plans.readPlan(planId);
    expect([version, json.kpis.map((kpi) => kpi.metric)]).toEqual([2, ["p95"]]);
  });

  it("cuts no new version when the document's content did not change", async () => {
    const { plans, planId } = await readyPlan();
    const doc = await liveDoc(plans, planId);
    await plans.storeDocument({ planId, doc, actor: "ana", reason: "auto" });
    expect(await plans.listVersions(planId)).toHaveLength(2);
  });

  it("keeps each version's own content, so version 1 stays the seeded plan", async () => {
    const { plans, planId } = await readyPlan();
    const first = await plans.getVersion(planId, 1);
    expect(first.json.kpis).toEqual([]);
  });

  it("refuses to approve a plan whose required sections are still empty", async () => {
    const plans = service();
    const { meta } = await plans.createPlan(NEW_PLAN);
    await expect(
      plans.approvePlan({ planId: meta.id, approvedBy: "ana" }),
    ).rejects.toThrow(PlanNotApprovableError);
  });

  it("approves a complete plan, recording who approved which version", async () => {
    const { plans, planId } = await readyPlan();
    const meta = await plans.approvePlan({ planId, approvedBy: "ana" });
    expect(meta).toMatchObject({
      status: "approved",
      approval: { approvedBy: "ana", version: 2, mode: "manual" },
    });
  });

  it("reopens an approved plan as a draft with no approval", async () => {
    const { plans, planId } = await readyPlan();
    await plans.approvePlan({ planId, approvedBy: "ana" });
    expect(await plans.reopenPlan(planId)).toMatchObject({
      status: "draft",
      approval: null,
    });
  });
});
