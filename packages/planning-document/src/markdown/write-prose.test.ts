import { describe, it, expect } from "vitest";

import type { ProseBlock } from "../blocks/prose-blocks.js";
import { applyOps } from "../ops/apply-ops.js";
import { templateFor } from "../template/templates.js";
import { richFeature, styledText } from "../testing/rich-prose.js";
import { markdownToOps } from "./markdown-to-ops.js";
import { planToMarkdown } from "./plan-to-markdown.js";
import { writeProse } from "./write-prose.js";

const block = (
  type: string,
  text: string,
  children: ProseBlock[] = [],
): ProseBlock => ({
  id: `${type}-${text}`,
  type: type as ProseBlock["type"],
  props: {},
  content: text === "" ? [] : [styledText(text)],
  children,
});

const FEATURE = templateFor("feature");
const RICH = richFeature();
const RICH_MD = planToMarkdown(RICH, FEATURE);

const edited = (from: string, to: string, markdown = RICH_MD) => {
  expect(markdown).toContain(from);

  return markdown.replace(from, to);
};

describe("writeProse", () => {
  it("reads a file spelling the same prose with * bullets and __bold__ as no change", () => {
    const markdown = edited(
      "- the `price_lookup()` call",
      "* the `price_lookup()` call",
      edited("**too long**", "__too long__"),
    );
    expect(markdownToOps(markdown, RICH, FEATURE)).toEqual({
      ops: [],
      problems: [],
    });
  });

  it("writes an edited file's prose back as the same Markdown once its ops apply", () => {
    const markdown = edited(
      "Latency is the product.",
      "Latency is **the** product.\n\n- [ ] new *check*",
    );
    const { ops } = markdownToOps(markdown, RICH, FEATURE);
    expect(planToMarkdown(applyOps(RICH, ops), FEATURE)).toEqual(markdown);
  });

  it("leaves out an empty paragraph, so the blocks around it stay one list", () => {
    expect(
      writeProse([
        block("numberedListItem", "one"),
        block("paragraph", ""),
        block("numberedListItem", "two"),
      ]),
    ).toEqual(["1. one", "2. two"]);
  });

  it("writes what nests under a paragraph after it, since Markdown nests only under list items", () => {
    expect(
      writeProse([block("paragraph", "parent", [block("paragraph", "child")])]),
    ).toEqual(["parent", "", "child"]);
  });

  it("gives a quote that reads like the conversation a second space", () => {
    const bold = {
      ...block("quote", ""),
      content: [styledText("Question", "bold"), styledText(" is ours")],
    };
    expect([
      writeProse([block("quote", "**Question** is ours")]),
      writeProse([bold]),
    ]).toEqual([
      ["> \\*\\*Question\\*\\* is ours"],
      [">  **Question** is ours"],
    ]);
  });

  it("indents a numbered item's children under its text", () => {
    expect(
      writeProse([
        block("numberedListItem", "one", [block("bulletListItem", "detail")]),
      ]),
    ).toEqual(["1. one", "   - detail"]);
  });
});
