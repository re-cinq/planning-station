import { describe, it, expect } from "vitest";

import { isRequiredAt, isAtLeast } from "./problems.js";

describe("isRequiredAt", () => {
  it("requires an always slot already at draft", () => {
    expect(isRequiredAt("always", "draft")).toBe(true);
  });

  it("does not require a for-approval slot at draft", () => {
    expect(isRequiredAt("for-approval", "draft")).toBe(false);
  });

  it("requires a for-approval slot at approval", () => {
    expect(isRequiredAt("for-approval", "approval")).toBe(true);
  });

  it("never requires an optional slot, even at approval", () => {
    expect(isRequiredAt("optional", "approval")).toBe(false);
  });
});

describe("isAtLeast", () => {
  it("counts approval as at least approval", () => {
    expect(isAtLeast("approval", "approval")).toBe(true);
  });

  it("does not count draft as at least approval", () => {
    expect(isAtLeast("draft", "approval")).toBe(false);
  });
});
