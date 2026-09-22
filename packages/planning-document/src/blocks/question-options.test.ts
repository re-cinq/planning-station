import { describe, it, expect } from "vitest";
import { encodeOptions, optionsOf } from "./question-options.js";

describe("question options", () => {
  it("keeps an option's own comma, so 'Nightly batch (simpler, matches existing pattern)' stays one option", () => {
    const options = [
      "Nightly batch (simpler, matches existing pattern)",
      "Post-merge trigger (fresher, more complex)",
    ];

    expect(optionsOf(encodeOptions(options))).toEqual(options);
  });

  it("reads a plan written before the options were encoded, where they were joined by commas", () => {
    expect(optionsOf("Yes, No, Both")).toEqual(["Yes", "No", "Both"]);
  });

  it("reads no options from an empty prop", () => {
    expect(optionsOf("")).toEqual([]);
  });
});
