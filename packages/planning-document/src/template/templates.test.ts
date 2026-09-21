import { describe, it, expect } from "vitest";

import {
  TEMPLATES,
  templateFor,
  slotFor,
  UnknownSlotError,
} from "./templates.js";

const slotsOf = (type: keyof typeof TEMPLATES) =>
  templateFor(type).slots.map((slot) => slot.slot);

describe("templateFor", () => {
  it("orders the feature slots from intent to open questions, with no tickets", () => {
    expect(slotsOf("feature")).toEqual([
      "intent",
      "kpis",
      "scope",
      "prototype",
      "constraints",
      "ownership",
      "delivery",
      "questions",
    ]);
  });

  it("starts an incident-response plan with the trigger slot", () => {
    expect(slotsOf("incident-response")[0]).toEqual("trigger");
  });

  it("gives a refactor plan a risk slot", () => {
    expect(slotsOf("refactor")).toContain("risk");
  });

  it("requires a click-dummy prototype for a ui-change plan", () => {
    expect({
      minimum: templateFor("ui-change").prototypeMinimum,
      required: slotFor(templateFor("ui-change"), "prototype").required,
    }).toEqual({ minimum: "click-dummy", required: "always" });
  });

  it("requires at least one kpi in every template", () => {
    const kpiMinimums = Object.values(TEMPLATES).map((template) =>
      JSON.stringify(slotFor(template, "kpis").requires),
    );
    expect(new Set(kpiMinimums)).toEqual(
      new Set([JSON.stringify([{ block: "kpi", min: 1 }])]),
    );
  });

  it("uses unique slot names within each template", () => {
    const duplicates = Object.values(TEMPLATES).filter(
      (template) =>
        new Set(slotsOf(template.type)).size !== template.slots.length,
    );
    expect(duplicates).toEqual([]);
  });
});

describe("slotFor", () => {
  it("returns the ownership slot titled Who operates it", () => {
    expect(slotFor(templateFor("feature"), "ownership")).toMatchObject({
      title: "Who operates it",
      required: "for-approval",
    });
  });

  it("throws UnknownSlotError for risk on a feature plan", () => {
    expect(() => slotFor(templateFor("feature"), "risk")).toThrow(
      new UnknownSlotError("feature has no slot risk"),
    );
  });
});
