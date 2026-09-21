import { describe, it, expect } from "vitest";

import { checkPlanStore } from "../testing/plan-store-check.js";
import {
  createMemoryPlanStore,
  UnknownPlanError,
} from "./memory-plan-store.js";

describe("createMemoryPlanStore", () => {
  it("passes every check of the plan store contract", async () => {
    expect(await checkPlanStore(createMemoryPlanStore())).toEqual([]);
  });

  it("throws UnknownPlanError when patching a plan nobody created", async () => {
    await expect(
      createMemoryPlanStore().updateMeta("nope", { status: "approved" }),
    ).rejects.toThrow(UnknownPlanError);
  });

  it("keeps each plan's versions apart", async () => {
    const store = createMemoryPlanStore();
    const plan = await store.createPlan({
      repo: "acme/shop",
      title: "Other plan",
      type: "refactor",
      createdBy: "ben",
    });
    expect(await store.listVersions(plan.id)).toEqual([]);
  });
});
