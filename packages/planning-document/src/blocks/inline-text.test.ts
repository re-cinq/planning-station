import { describe, it, expect } from "vitest";

import {
  plainText,
  inlineFromText,
  inlineContentSchema,
} from "./inline-text.js";

describe("plainText", () => {
  it("returns 'Reduce p95' for one text node", () => {
    expect(
      plainText([{ type: "text", text: "Reduce p95", styles: {} }]),
    ).toEqual("Reduce p95");
  });

  it("joins a text node and a link into 'see the ADR'", () => {
    expect(
      plainText([
        { type: "text", text: "see ", styles: {} },
        {
          type: "link",
          href: "https://example.com/adr",
          content: [{ type: "text", text: "the ADR", styles: {} }],
        },
      ]),
    ).toEqual("see the ADR");
  });

  it("returns an empty string for no nodes", () => {
    expect(plainText([])).toEqual("");
  });
});

describe("inlineFromText", () => {
  it("returns one unstyled text node for 'Checkout conversion'", () => {
    expect(inlineFromText("Checkout conversion")).toEqual([
      { type: "text", text: "Checkout conversion", styles: {} },
    ]);
  });

  it("returns no nodes for an empty string", () => {
    expect(inlineFromText("")).toEqual([]);
  });

  it("round-trips through plainText for 'Lead time to prod'", () => {
    expect(plainText(inlineFromText("Lead time to prod"))).toEqual(
      "Lead time to prod",
    );
  });
});

describe("inlineContentSchema", () => {
  it("defaults styles to an empty object when a text node omits it", () => {
    expect(inlineContentSchema.parse([{ type: "text", text: "hi" }])).toEqual([
      { type: "text", text: "hi", styles: {} },
    ]);
  });

  it("rejects a node whose type is heading", () => {
    expect(inlineContentSchema.safeParse([{ type: "heading" }]).success).toBe(
      false,
    );
  });
});
