import { describe, it, expect } from "vitest";
import { templateFor } from "@re-cinq/planning-document";

import { outlineSections } from "./outline-sections.js";

const FEATURE = templateFor("feature");

const WITHOUT_PROTOTYPE = FEATURE.slots.filter(
  ({ slot }) => slot !== "prototype",
);

const SECTIONS = WITHOUT_PROTOTYPE.map(({ slot, title }) => ({ slot, title }));

describe("outlineSections", () => {
  it("lists a missing Prototype as required when the plan never dropped it", () => {
    const outline = outlineSections(
      FEATURE,
      { sections: SECTIONS },
      "approval",
    );
    expect(outline.find(({ slot }) => slot === "prototype")).toEqual({
      slot: "prototype",
      title: "Prototype",
      required: true,
      inPlan: false,
    });
  });

  it("leaves out a dropped Prototype", () => {
    const outline = outlineSections(
      FEATURE,
      { sections: SECTIONS, droppedSlots: ["prototype"] },
      "approval",
    );
    expect(outline.map(({ slot }) => slot)).toEqual(
      SECTIONS.map(({ slot }) => slot),
    );
  });
});
