import { describe, it, expect } from "vitest";

import { planMetaSchema } from "./plan-meta.js";

const META = {
  schemaVersion: 1,
  id: "8e3c1f0a-0000-4000-8000-000000000001",
  repo: "acme/shop",
  type: "performance",
  templateVersion: 1,
  title: "Checkout under 200 ms",
  status: "draft",
  approval: null,
  version: 0,
  createdBy: "octocat",
  updatedAt: "2026-09-19T10:00:00.000Z",
};

describe("planMetaSchema", () => {
  it("parses a draft performance plan for acme/shop", () => {
    expect(planMetaSchema.parse(META)).toEqual(META);
  });

  it("parses an approved plan whose approval points at version 3", () => {
    const approval = {
      mode: "manual",
      approvedBy: "octocat",
      approvedAt: "2026-09-19T11:00:00.000Z",
      version: 3,
    };
    expect(
      planMetaSchema.parse({
        ...META,
        status: "approved",
        approval,
        version: 3,
      }),
    ).toMatchObject({ status: "approved", approval });
  });

  it("rejects the repo 'shop' without an owner", () => {
    expect(planMetaSchema.safeParse({ ...META, repo: "shop" }).success).toBe(
      false,
    );
  });

  it("rejects the plan type 'epic'", () => {
    expect(planMetaSchema.safeParse({ ...META, type: "epic" }).success).toBe(
      false,
    );
  });

  it("rejects schemaVersion 2", () => {
    expect(
      planMetaSchema.safeParse({ ...META, schemaVersion: 2 }).success,
    ).toBe(false);
  });
});
