import { describe, it, expect } from "vitest";
import type { Problem } from "@re-cinq/planning-document";

import type { OutlineSection } from "./outline-sections.js";
import { requiredProgress, sectionState } from "./section-state.js";

const section = (overrides: Partial<OutlineSection> = {}): OutlineSection => ({
  slot: "intent",
  title: "What we want and why",
  required: true,
  inPlan: true,
  ...overrides,
});

const PROBLEM: Problem = {
  code: "missing-block",
  slot: "intent",
  message: "needs content",
};

describe("sectionState", () => {
  it("reads a section with a problem as problem", () => {
    expect(sectionState(section(), [PROBLEM])).toBe("problem");
  });

  it("reads a section the plan lacks as missing", () => {
    expect(sectionState(section({ inPlan: false }), [])).toBe("missing");
  });

  it("reads a section in the plan without problems as ready", () => {
    expect(sectionState(section(), [])).toBe("ready");
  });
});

describe("requiredProgress", () => {
  it("counts 2 of 3 required sections ready", () => {
    const rows = [
      { section: section({ slot: "a" }), problems: [] },
      { section: section({ slot: "b" }), problems: [] },
      { section: section({ slot: "c" }), problems: [PROBLEM] },
      { section: section({ slot: "d", required: false }), problems: [] },
    ];

    expect(requiredProgress(rows)).toEqual({ ready: 2, total: 3 });
  });
});
