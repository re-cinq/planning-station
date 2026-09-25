import { describe, it, expect } from "vitest";

import { applyOps } from "../ops/apply-ops.js";
import { templateFor } from "../template/templates.js";
import { resolveFinding } from "../testing/findings.js";
import { planWith, readyFeature, textBlock } from "../testing/plans.js";
import { richFeature } from "../testing/rich-prose.js";
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

  it("writes a section's blocks parted by blank lines, and a list's items together", () => {
    const blocks = planWith("feature", {
      scope: [
        textBlock("paragraph", {}, "Only the price lookup."),
        textBlock("bulletListItem", {}, "Not the payment page."),
        textBlock("bulletListItem", {}, "Not the basket."),
      ],
    });
    expect(planToMarkdown(blocks, FEATURE)).toContain(
      "<!-- slot:scope -->\n\nOnly the price lookup.\n\n- Not the payment page.\n- Not the basket.\n",
    );
  });

  it("writes every kind of prose block with its marks, links and nesting as Markdown", () => {
    const markdown = planToMarkdown(richFeature(), FEATURE);
    const scope = markdown.slice(
      markdown.indexOf("<!-- slot:scope -->"),
      markdown.indexOf("## Prototype"),
    );
    expect(scope.split("\n")).toEqual([
      "<!-- slot:scope -->",
      "",
      "**In scope**",
      "",
      "- the `price_lookup()` call",
      "  - *cached* per market",
      "1. measure",
      "2. ship ~~v1~~",
      "- [x] flag exists",
      "- [ ] rollout plan",
      "",
      "> Latency is the product.",
      "",
      "```ts",
      "const p95 = 200;",
      "## not a section",
      "```",
      "",
      "| Market | p95 |",
      "| --- | --- |",
      "| DE | 200 ms |",
      "",
      "See [the ADR](https://example.com/adr) before - 1. or \\*this\\*",
      "",
      "",
    ]);
  });

  it("writes a level 2 heading in the prose as a subheading, below the section's own", () => {
    expect(linesOf(planToMarkdown(richFeature(), FEATURE))).toContain(
      "### Why now",
    );
  });

  it("escapes a paragraph that would read as a list, a numbered item or a quote", () => {
    const blocks = planWith("feature", {
      scope: [
        textBlock("paragraph", {}, "- not a list"),
        textBlock("paragraph", {}, "1. not numbered"),
        textBlock("paragraph", {}, "> not a quote"),
      ],
    });
    expect(linesOf(planToMarkdown(blocks, FEATURE))).toEqual(
      expect.arrayContaining([
        "\\- not a list",
        "1\\. not numbered",
        "\\> not a quote",
      ]),
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

  it("quotes a resolved finding with its severity and why", () => {
    const withFinding = applyOps(planWith("feature", {}), [
      {
        op: "add-finding",
        slot: "intent",
        findingId: "f-abc123",
        text: "The plan promises Danish status labels but names none",
        why: "FR-166 keys the card on fixed text",
        severity: "blocker",
      },
    ]);
    const blocks = resolveFinding(withFinding, "f-abc123");
    expect(planToMarkdown(blocks, FEATURE)).toContain(
      "> **Finding** (f-abc123, blocker, resolved): The plan promises Danish status labels but names none — FR-166 keys the card on fixed text",
    );
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
