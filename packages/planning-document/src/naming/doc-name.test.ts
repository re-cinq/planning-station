import { describe, it, expect } from "vitest";

import { docName, parseDocName, DocNameError } from "./doc-name.js";

const PLAN_ID = "8e3c1f0a-1b2c-4d3e-8f40-123456789abc";

describe("docName", () => {
  it("formats acme/shop and a uuid as plan:acme/shop:<uuid>", () => {
    expect(docName({ repo: "acme/shop", planId: PLAN_ID })).toEqual(
      `plan:acme/shop:${PLAN_ID}`,
    );
  });

  it("throws DocNameError for the plan id 42", () => {
    expect(() => docName({ repo: "acme/shop", planId: "42" })).toThrow(
      new DocNameError("invalid plan document parts acme/shop 42"),
    );
  });

  it("throws DocNameError for a repo without an owner", () => {
    expect(() => docName({ repo: "shop", planId: PLAN_ID })).toThrow(
      DocNameError,
    );
  });
});

describe("parseDocName", () => {
  it("parses plan:acme/shop:<uuid> into its repo and plan id", () => {
    expect(parseDocName(`plan:acme/shop:${PLAN_ID}`)).toEqual({
      repo: "acme/shop",
      planId: PLAN_ID,
    });
  });

  it("round-trips a repo with dots and underscores", () => {
    const parts = { repo: "acme_co/web.app", planId: PLAN_ID };
    expect(parseDocName(docName(parts))).toEqual(parts);
  });

  it("throws DocNameError for a document named notes:1", () => {
    expect(() => parseDocName("notes:1")).toThrow(
      new DocNameError("invalid plan document name notes:1"),
    );
  });

  it("throws DocNameError for a repo path with three segments", () => {
    expect(() => parseDocName(`plan:a/b/c:${PLAN_ID}`)).toThrow(DocNameError);
  });
});
