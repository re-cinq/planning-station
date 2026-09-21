import { describe, it, expect } from "vitest";

import { kpiSchema } from "./entities.js";

describe("kpiSchema", () => {
  it("parses a conversion KPI moving up from 2.1 % to 2.6 %", () => {
    const kpi = {
      id: "k1",
      metric: "checkout conversion",
      baseline: "2.1 %",
      target: "2.6 %",
      direction: "up",
      deadline: "2026-12-31",
      rationale: "Revenue target for Q4",
    };
    expect(kpiSchema.parse(kpi)).toEqual(kpi);
  });

  it("rejects the direction sideways", () => {
    expect(
      kpiSchema.safeParse({
        id: "k1",
        metric: "m",
        baseline: "",
        target: "",
        direction: "sideways",
        deadline: "",
        rationale: "",
      }).success,
    ).toBe(false);
  });
});
