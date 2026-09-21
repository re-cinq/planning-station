import { describe, it, expect } from "vitest";
import {
  PLAN_BLOCK_KINDS,
  PROSE_BLOCK_KINDS,
} from "@re-cinq/planning-document";

import { planSchema } from "./plan-schema.js";

describe("planSchema", () => {
  it("registers exactly the contract's prose and plan block kinds", () => {
    expect(Object.keys(planSchema.blockSpecs).sort()).toEqual(
      [...PROSE_BLOCK_KINDS, ...PLAN_BLOCK_KINDS].sort(),
    );
  });

  it("offers heading levels 2 and 3 only, defaulting to 2", () => {
    const { heading } = planSchema.blockSpecs;
    const { propSchema } = heading.config;
    expect(propSchema.level).toMatchObject({
      default: 2,
      values: [2, 3],
    });
  });
});
