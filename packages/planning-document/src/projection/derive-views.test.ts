import { describe, it, expect } from "vitest";

import { block, paragraph } from "../testing/block-builders.js";
import { kpisOf, prototypeOf } from "./derive-views.js";

describe("kpisOf", () => {
  it("projects two kpi blocks in document order with their rationale", () => {
    expect(
      kpisOf([
        block(
          "kpi",
          {
            kpiId: "k1",
            metric: "p95",
            baseline: "450 ms",
            target: "200 ms",
            direction: "down",
          },
          { text: "Checkout feels slow" },
        ),
        paragraph("between"),
        block("kpi", { kpiId: "k2", metric: "conversion", direction: "up" }),
      ]),
    ).toEqual([
      {
        id: "k1",
        metric: "p95",
        baseline: "450 ms",
        target: "200 ms",
        direction: "down",
        deadline: "",
        rationale: "Checkout feels slow",
      },
      {
        id: "k2",
        metric: "conversion",
        baseline: "",
        target: "",
        direction: "up",
        deadline: "",
        rationale: "",
      },
    ]);
  });
});

describe("prototypeOf", () => {
  it("returns the first prototype declaration, a click-dummy agreed by ana", () => {
    expect(
      prototypeOf([
        block(
          "prototype",
          { maturity: "click-dummy", agreedBy: "ana" },
          { text: "Fake data" },
        ),
        block("prototype", { maturity: "pre-prod" }),
      ]),
    ).toEqual({
      maturity: "click-dummy",
      url: "",
      agreedBy: "ana",
      notes: "Fake data",
    });
  });

  it("returns null without a prototype block", () => {
    expect(prototypeOf([paragraph("no prototype")])).toBeNull();
  });
});
