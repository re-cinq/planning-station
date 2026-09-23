import { describe, it, expect } from "vitest";

import type { BlockJson } from "../blocks/block-json.js";
import { templateFor } from "../template/templates.js";
import { planWith, textBlock } from "../testing/plans.js";
import { markdownToOps } from "./markdown-to-ops.js";
import { planToMarkdown } from "./plan-to-markdown.js";

const FEATURE = templateFor("feature");

const opsFor = (markdown: string, blocks: BlockJson[]) =>
  markdownToOps(markdown, blocks, FEATURE);

const edited = (from: string, to: string, markdown: string) => {
  expect(markdown).toContain(from);

  return markdown.replace(from, to);
};

const passOver = (plan: BlockJson[], from: string, to: string) =>
  opsFor(edited(from, to, planToMarkdown(plan, FEATURE)), plan);

const ONE_REFUSAL = [{ code: "disallowed-block", slot: "questions" }];

const BULLET_THEN_OMEGA = planWith("feature", {
  questions: [
    textBlock("bulletListItem", {}, "Regions?"),
    textBlock("paragraph", {}, "Omega."),
  ],
});

describe("markdownToOps and what a section has no place for", () => {
  it("refuses bullets written under Open questions, keeps the paragraph beside them, and reports each bullet", () => {
    const asked = planWith("feature", {
      questions: [textBlock("paragraph", {}, "Two things are open.")],
    });

    expect(
      passOver(
        asked,
        "Two things are open.",
        "Two things are open.\n\nThey are listed here:\n\n- Which regions?\n- Which quarter?",
      ),
    ).toMatchObject({
      ops: [
        {
          op: "insert-blocks",
          slot: "questions",
          blocks: [{ type: "paragraph" }],
        },
      ],
      problems: [
        {
          code: "disallowed-block",
          slot: "questions",
          message: 'a bulletListItem block does not belong in "Open questions"',
        },
        {
          code: "disallowed-block",
          slot: "questions",
          message: 'a bulletListItem block does not belong in "Open questions"',
        },
      ],
    });
  });

  it("leaves the bullets a person wrote under Open questions when the pass rewords them, and reports each reworded bullet", () => {
    const asked = planWith("feature", {
      questions: [
        textBlock("bulletListItem", {}, "Regions?"),
        textBlock("bulletListItem", {}, "Quarter?"),
      ],
    });
    const markdown = edited(
      "- Quarter?",
      "- Which quarter?",
      edited("- Regions?", "- Which regions?", planToMarkdown(asked, FEATURE)),
    );

    expect(opsFor(markdown, asked)).toMatchObject({
      ops: [],
      problems: [
        { code: "disallowed-block", slot: "questions" },
        { code: "disallowed-block", slot: "questions" },
      ],
    });
  });

  it("keeps a person's bullet under Open questions when the pass writes a paragraph in its place", () => {
    const asked = planWith("feature", {
      questions: [textBlock("bulletListItem", {}, "Regions?")],
    });
    const { ops } = passOver(
      asked,
      "- Regions?",
      "Context first.\n\n- Which regions?",
    );

    expect(ops.map((op) => op.op)).toEqual(["insert-blocks"]);
  });

  it("reads back a plan holding a section its template lacks without throwing", () => {
    const incident = planWith("incident-response", {
      trigger: [textBlock("paragraph", {}, "Checkout went down.")],
    });
    const markdown = planToMarkdown(incident, templateFor("incident-response"));

    expect(() => opsFor(markdown, incident)).not.toThrow();
  });

  it("anchors a paragraph the pass adds below a person's bullet under Open questions to that bullet", () => {
    const asked = planWith("feature", {
      questions: [
        textBlock("paragraph", {}, "Alpha."),
        textBlock("bulletListItem", {}, "Regions?"),
        textBlock("paragraph", {}, "Omega."),
      ],
    });
    const bullet = asked.find((block) => block.type === "bulletListItem");

    expect(
      passOver(asked, "- Regions?", "- Regions?\n\nNew after bullet."),
    ).toMatchObject({
      ops: [{ op: "insert-blocks", after: bullet?.id }],
      problems: [],
    });
  });

  it("refuses a second copy of a person's bullet under Open questions and reports it", () => {
    const asked = planWith("feature", {
      questions: [textBlock("bulletListItem", {}, "Regions?")],
    });

    expect(
      passOver(asked, "- Regions?", "- Regions?\n- Regions?"),
    ).toMatchObject({
      ops: [],
      problems: ONE_REFUSAL,
    });
  });

  it("leaves a person's bullet under Open questions where it stands when the pass moves it, and reports the move", () => {
    const asked = BULLET_THEN_OMEGA;

    expect(
      passOver(asked, "- Regions?\n\nOmega.", "Omega.\n\n- Regions?"),
    ).toMatchObject({
      ops: [],
      problems: ONE_REFUSAL,
    });
  });

  it("writes the pass's paragraph after a person's bullet under Open questions rather than over it, when the pass moves the bullet down", () => {
    const asked = BULLET_THEN_OMEGA;
    const bullet = asked.find((block) => block.type === "bulletListItem");

    expect(
      passOver(
        asked,
        "- Regions?\n\nOmega.",
        "New para.\n\nOmega.\n\n- Regions?",
      ),
    ).toMatchObject({
      ops: [
        {
          op: "insert-blocks",
          after: bullet?.id,
          blocks: [{ type: "paragraph" }],
        },
      ],
      problems: ONE_REFUSAL,
    });
  });
});
