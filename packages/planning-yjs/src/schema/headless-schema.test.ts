import { describe, it, expect } from "vitest";
import {
  PLAN_BLOCK_KINDS,
  PROSE_BLOCK_KINDS,
} from "@re-cinq/planning-document";

import { headlessPlanSchema } from "./headless-schema.js";

describe("headlessPlanSchema", () => {
  it("registers exactly the contract's prose and plan block kinds", () => {
    expect(Object.keys(headlessPlanSchema.blockSpecs).sort()).toEqual(
      [...PROSE_BLOCK_KINDS, ...PLAN_BLOCK_KINDS].sort(),
    );
  });
});
