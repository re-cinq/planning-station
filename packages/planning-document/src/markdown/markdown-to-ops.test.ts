import { describe, it, expect } from "vitest";

import type { BlockJson } from "../blocks/block-json.js";
import { applyOps } from "../ops/apply-ops.js";
import type { PlanKind } from "../plan/plan-meta.js";
import { partitionSections } from "../projection/partition.js";
import { PLAN_KINDS } from "../plan/plan-meta.js";
import { templateFor } from "../template/templates.js";
import { planWith, readyFeature, textBlock } from "../testing/plans.js";
import { richFeature, styledText } from "../testing/rich-prose.js";
import { markdownToOps } from "./markdown-to-ops.js";
import { planToMarkdown } from "./plan-to-markdown.js";

const FEATURE = templateFor("feature");
const READY = readyFeature();
const READY_MD = planToMarkdown(READY, FEATURE);

const plain = (text: string) => styledText(text);

const TALKED = planWith("feature", {
  intent: [
    textBlock("paragraph", {}, "Checkout takes too long.\nMostly on mobile."),
    textBlock("bulletListItem", {}, "# Not a heading"),
    textBlock("question", { questionId: "q-market" }, "Which market first?"),
    textBlock("answer", { questionId: "q-market" }, "Germany"),
    textBlock("comment", { commentId: "c1", author: "ana" }, "Why now?"),
  ],
  kpis: [textBlock("kpi", { kpiId: "k-new" }, "")],
  prototype: [
    textBlock("prototype", { maturity: "running-prototype" }, "Try it"),
    textBlock("mockup", { format: "svg" }, ""),
  ],
});

const WITH_ROLLOUT = applyOps(READY, [
  {
    op: "add-section",
    slot: "custom-rollout",
    title: "Rollout",
    after: "scope",
    paragraphs: ["Behind a flag."],
  },
]);

const opsFor = (markdown: string, blocks: BlockJson[] = READY) =>
  markdownToOps(markdown, blocks, FEATURE);

const edited = (from: string, to: string, markdown = READY_MD) => {
  expect(markdown).toContain(from);

  return markdown.replace(from, to);
};

const roundTrip = (blocks: BlockJson[], type: PlanKind) =>
  markdownToOps(
    planToMarkdown(blocks, templateFor(type)),
    blocks,
    templateFor(type),
  );

describe("markdownToOps", () => {
  it("reads every fixture plan back as no ops and no problems", () => {
    const plans: [BlockJson[], PlanKind][] = [
      [READY, "feature"],
      [TALKED, "feature"],
      [WITH_ROLLOUT, "feature"],
      [richFeature(), "feature"],
      ...PLAN_KINDS.map((type): [BlockJson[], PlanKind] => [
        planWith(type, {}),
        type,
      ]),
    ];
    expect(plans.map(([blocks, type]) => roundTrip(blocks, type))).toEqual(
      plans.map(() => ({ ops: [], problems: [] })),
    );
  });

  it("rewrites the intent when its paragraph changed", () => {
    expect(
      opsFor(
        edited("Checkout takes too long.", "Checkout is slow.\n\nFix it."),
      ),
    ).toEqual({
      ops: [
        {
          op: "set-section-prose",
          slot: "intent",
          blocks: [
            { type: "paragraph", content: [plain("Checkout is slow.")] },
            { type: "paragraph", content: [plain("Fix it.")] },
          ],
        },
      ],
      problems: [],
    });
  });

  it("upserts KPI k1 when its target changed to 150 ms", () => {
    expect(opsFor(edited('"200 ms"', '"150 ms"')).ops).toMatchObject([
      { op: "upsert-kpi", kpi: { kpiId: "k1", target: "150 ms" } },
    ]);
  });

  it("mints an id for a new KPI fence written without one", () => {
    const markdown = edited(
      "<!-- slot:kpis -->\n",
      '<!-- slot:kpis -->\n\n```kpi\n{"metric": "errors", "target": "0"}\n```\n',
    );
    expect(opsFor(markdown).ops).toEqual([
      {
        op: "upsert-kpi",
        kpi: expect.objectContaining({
          kpiId: expect.stringMatching(/^kpi_/),
          metric: "errors",
        }),
      },
    ]);
  });

  it("sets the prototype when its maturity moved to running-prototype", () => {
    expect(
      opsFor(edited('"click-dummy"', '"running-prototype"')).ops,
    ).toMatchObject([
      { op: "set-prototype", prototype: { maturity: "running-prototype" } },
    ]);
  });

  it("asks a new question fence in scope under a minted id", () => {
    const markdown = edited(
      "Only the price lookup.",
      'Only the price lookup.\n\n```question\n{"question": "Which flag?", "kind": "choice", "options": ["beta", "canary"]}\n```',
    );
    expect(opsFor(markdown).ops).toEqual([
      {
        op: "add-question",
        slot: "scope",
        questionId: expect.stringMatching(/^q_/),
        question: "Which flag?",
        why: "",
        kind: "choice",
        options: ["beta", "canary"],
      },
    ]);
  });

  it("adds a Rollout heading without a marker as a new section after scope, with its prose and question", () => {
    const markdown = edited(
      "## Prototype <!-- slot:prototype -->",
      '## Rollout\n\nBehind a flag.\n\n```question\n{"question": "Which flag?"}\n```\n\n## Prototype <!-- slot:prototype -->',
    );
    const { ops } = opsFor(markdown);
    const [added] = ops;
    const slot = added && "slot" in added ? added.slot : "";
    expect(ops).toEqual([
      {
        op: "add-section",
        slot: expect.stringMatching(/^custom-/),
        title: "Rollout",
        after: "scope",
        paragraphs: [],
      },
      {
        op: "set-section-prose",
        slot,
        blocks: [{ type: "paragraph", content: [plain("Behind a flag.")] }],
      },
      expect.objectContaining({
        op: "add-question",
        slot,
        question: "Which flag?",
      }),
    ]);
  });

  it("places the new section where the file puts it once the ops apply", () => {
    const markdown = edited(
      "## Prototype <!-- slot:prototype -->",
      "## Rollout\n\nBehind a flag.\n\n## Prototype <!-- slot:prototype -->",
    );
    const titles = partitionSections(applyOps(READY, opsFor(markdown).ops)).map(
      (section) => section.title,
    );
    expect(titles.slice(2, 5)).toEqual([
      "In and out of scope",
      "Rollout",
      "Prototype",
    ]);
  });

  it("puts a new section written before every marked one after the plan's last section", () => {
    const markdown = edited(
      "# Faster checkout\n",
      "# Faster checkout\n\n## Appendix\n",
    );
    expect(opsFor(markdown).ops).toMatchObject([
      { op: "add-section", title: "Appendix", after: "questions" },
    ]);
  });

  it("retitles the agent's Rollout section to Staged rollout", () => {
    const markdown = edited(
      "## Rollout <!-- slot:custom-rollout -->",
      "## Staged rollout <!-- slot:custom-rollout -->",
      planToMarkdown(WITH_ROLLOUT, FEATURE),
    );
    expect(opsFor(markdown, WITH_ROLLOUT)).toEqual({
      ops: [
        {
          op: "set-section-title",
          slot: "custom-rollout",
          title: "Staged rollout",
        },
      ],
      problems: [],
    });
  });

  it("reports a renamed template section as a problem and changes nothing", () => {
    expect(
      opsFor(
        edited(
          "## In and out of scope <!-- slot:scope -->",
          "## Scope <!-- slot:scope -->",
        ),
      ),
    ).toEqual({
      ops: [],
      problems: [
        {
          code: "renamed-template-section",
          slot: "scope",
          message:
            '"In and out of scope" belongs to the template and keeps its title',
        },
      ],
    });
  });

  it("ignores edited and added conversation quotes", () => {
    const markdown = edited(
      "> **Question** (q-market): Which market first?",
      "> **Question** (q-market): Which market?\n> **Answer**: France",
      planToMarkdown(TALKED, FEATURE),
    );
    expect(opsFor(markdown, TALKED)).toEqual({ ops: [], problems: [] });
  });

  it("reports a kpi fence that is not JSON and applies nothing from it", () => {
    const markdown = edited('"kpiId": "k1",', '"kpiId": "k1"');
    expect(opsFor(markdown)).toMatchObject({
      ops: [],
      problems: [{ code: "invalid-fence", slot: "kpis" }],
    });
  });

  it("reports a marker naming no section of the plan", () => {
    expect(
      opsFor(`${READY_MD}\n## Risk <!-- slot:risk -->\n\nIt could break.\n`),
    ).toEqual({
      ops: [],
      problems: [
        {
          code: "unknown-section",
          slot: "risk",
          message: "the plan has no section risk",
        },
      ],
    });
  });

  it("leaves a section the file no longer holds alone", () => {
    const [kept] = READY_MD.split("\n## In and out of scope");
    expect(opsFor(kept ?? "")).toEqual({ ops: [], problems: [] });
  });

  it(
    "converts a 2 MB plan both ways in under 2 seconds",
    { timeout: 2_000 },
    () => {
      const paragraphs = [...Array(11_000).keys()].map((index) =>
        textBlock("paragraph", {}, `Paragraph ${index} ${"x".repeat(90)}`),
      );
      const large = planWith("feature", {
        intent: paragraphs,
        scope: paragraphs,
      });
      const markdown = planToMarkdown(large, FEATURE);
      expect({
        large: markdown.length > 2_000_000,
        result: markdownToOps(markdown, large, FEATURE),
      }).toEqual({ large: true, result: { ops: [], problems: [] } });
    },
  );
});
