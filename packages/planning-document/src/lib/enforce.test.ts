import { describe, it, expect } from "vitest";

import { enforceTrue } from "./enforce.js";

class PlanShapeError extends Error {}

describe("enforceTrue", () => {
  it("returns without throwing when the condition is a non-empty string", () => {
    expect(() =>
      enforceTrue("intent", PlanShapeError, "missing"),
    ).not.toThrow();
  });

  it("throws the given error class with the message when the condition is null", () => {
    expect(() => enforceTrue(null, PlanShapeError, "no section")).toThrow(
      new PlanShapeError("no section"),
    );
  });

  it("throws the error a factory builds when the condition is an empty string", () => {
    const badRequest = (message: string) => new TypeError(message);
    expect(() => enforceTrue("", badRequest, "slot unknown")).toThrow(
      new TypeError("slot unknown"),
    );
  });
});
