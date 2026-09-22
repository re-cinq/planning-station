import { describe, it, expect } from "vitest";

import { applyOps } from "../ops/apply-ops.js";
import { templateFor } from "../template/templates.js";
import { planWith, readyFeature, textBlock } from "../testing/plans.js";
import { planToMarkdown } from "./plan-to-markdown.js";

const FEATURE = templateFor("feature");

const TALKED = planWith("feature", {
  intent: [
    textBlock("paragraph", {}, "Checkout takes too long."),
    textBlock("question", { questionId: "q-market" }, "Which market first?"),
    textBlock("answer", { questionId: "q-market" }, "Germany"),
    textBlock(
      "comment",
      { commentId: "c1", author: "ana", resolved: true },
      "Why now?",
    ),
  ],
  prototype: [textBlock("mockup", { format: "mermaid" }, "")],
});

const linesOf = (markdown: string) => markdown.split("\n");

describe("planToMarkdown", () => {
  it("writes the plan title, then each section as a level 2 heading marked with its slot", () => {
    expect(
      linesOf(planToMarkdown(readyFeature(), FEATURE)).slice(0, 3),
    ).toEqual([
      "# Faster checkout",
      "",
      "## What we want and why <!-- slot:intent -->",
    ]);
  });

  it("titles a refactor plan's kpis section What must stay true, as its template does", () => {
    expect(
      linesOf(
        planToMarkdown(planWith("refactor", {}), templateFor("refactor")),
      ),
    ).toContain("## What must stay true <!-- slot:kpis -->");
  });

  it("writes a section's prose as paragraphs parted by blank lines", () => {
    const blocks = planWith("feature", {
      scope: [
        textBlock("paragraph", {}, "Only the price lookup."),
        textBlock("bulletListItem", {}, "Not the payment page."),
      ],
    });
    expect(planToMarkdown(blocks, FEATURE)).toContain(
      "<!-- slot:scope -->\n\nOnly the price lookup.\n\nNot the payment page.\n",
    );
  });

  it("writes the p95 KPI as a kpi fence holding its fields and rationale", () => {
    expect(planToMarkdown(readyFeature(), FEATURE)).toContain(
      [
        "```kpi",
        JSON.stringify(
          {
            kpiId: "k1",
            metric: "p95",
            baseline: "450 ms",
            target: "200 ms",
            direction: "up",
            deadline: "",
            rationale: "Every 100 ms costs a point of conversion.",
          },
          null,
          2,
        ),
        "```",
      ].join("\n"),
    );
  });

  it("writes the click-dummy prototype as a prototype fence", () => {
    expect(planToMarkdown(readyFeature(), FEATURE)).toContain(
      [
        "```prototype",
        JSON.stringify(
          { maturity: "click-dummy", url: "", agreedBy: "", notes: "" },
          null,
          2,
        ),
        "```",
      ].join("\n"),
    );
  });

  it("notes a mermaid mockup without its markup", () => {
    expect(linesOf(planToMarkdown(TALKED, FEATURE))).toContain(
      "_(mockup: mermaid, not editable here)_",
    );
  });

  it("quotes the question q-market with its answer and Ana's resolved comment", () => {
    const lines = linesOf(planToMarkdown(TALKED, FEATURE));
    expect(lines.filter((line) => line.startsWith(">"))).toEqual([
      "> **Comment** by ana (resolved): Why now?",
      "> **Question** (q-market): Which market first?",
      "> **Answer**: Germany",
    ]);
  });

  it("escapes a paragraph that would read as a heading", () => {
    const blocks = planWith("feature", {
      scope: [textBlock("paragraph", {}, "## not a section")],
    });
    expect(linesOf(planToMarkdown(blocks, FEATURE))).toContain(
      "\\## not a section",
    );
  });

  it("writes the agent's Rollout section under its own title", () => {
    const blocks = applyOps(readyFeature(), [
      {
        op: "add-section",
        slot: "custom-rollout",
        title: "Rollout",
        after: "scope",
        paragraphs: [],
      },
    ]);
    expect(linesOf(planToMarkdown(blocks, FEATURE))).toContain(
      "## Rollout <!-- slot:custom-rollout -->",
    );
  });
});
