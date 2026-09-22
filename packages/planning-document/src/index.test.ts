import { describe, it, expect } from "vitest";

import * as planningDocument from "./index.js";

describe("@re-cinq/planning-document public surface", () => {
  it("exports the projection, validation and naming entry points", () => {
    expect(
      [
        "toPlanDocument",
        "toBlocks",
        "seedBlocks",
        "validatePlan",
        "templateFor",
        "docName",
        "parseDocName",
        "planDocumentSchema",
        "PLAN_BLOCK_CONFIGS",
        "PLAN_FRAGMENT",
        "sectionSlotFor",
        "planToMarkdown",
        "markdownToOps",
      ].filter((name) => !(name in planningDocument)),
    ).toEqual([]);
  });
});
