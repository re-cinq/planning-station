import { describe, it, expect } from "vitest";

import { newId } from "./ids.js";

describe("newId", () => {
  it("returns kpi_ followed by a uuid", () => {
    expect(newId("kpi")).toMatch(
      /^kpi_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("returns a different value on each call", () => {
    expect(newId("t")).not.toEqual(newId("t"));
  });
});
