import { describe, it, expect } from "vitest";
import type { Problem } from "@re-cinq/planning-document";

import { problemsBySlot } from "./problems-by-slot.js";

const problem = (code: Problem["code"], slot: string): Problem => ({
  code,
  message: code,
  slot,
});

describe("problemsBySlot", () => {
  it("files a prototype problem under the prototype section", () => {
    const below = problem("prototype-below-minimum", "prototype");
    expect(problemsBySlot([below]).get("prototype")).toEqual([below]);
  });

  it("keeps two kpis problems together in report order", () => {
    const empty = problem("empty-required-section", "kpis");
    const missing = problem("missing-block", "kpis");
    expect(problemsBySlot([empty, missing]).get("kpis")).toEqual([
      empty,
      missing,
    ]);
  });
});
