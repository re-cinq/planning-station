import { describe, it, expect } from "vitest";

import { templateFor } from "../template/templates.js";
import { readyFeature } from "../testing/plans.js";
import { styledText } from "../testing/rich-prose.js";
import { markdownToOps } from "./markdown-to-ops.js";
import { readProse } from "./read-prose.js";

const plain = (text: string) => styledText(text);

const bullet = (text: string, children: object[] = []) => ({
  type: "bulletListItem",
  content: [plain(text)],
  children,
});

const scopeOps = (lines: string[]) =>
  markdownToOps(
    ["## In and out of scope <!-- slot:scope -->", "", ...lines].join("\n"),
    readyFeature(),
    templateFor("feature"),
  ).ops;

describe("readProse", () => {
  it("reads bold labels and bullet lists with code and bold as one set-section-prose, leaving no ** or - in the text", () => {
    const ops = scopeOps([
      "**In scope**",
      "",
      "- The `price_lookup()` call, **cached** per market",
      "- Mobile checkout",
      "",
      "**Out of scope**",
      "",
      "- The payment page",
    ]);
    expect({
      ops,
      literal: /"text":"[^"]*(\*\*|- )/.test(JSON.stringify(ops)),
    }).toEqual({
      ops: [
        {
          op: "set-section-prose",
          slot: "scope",
          blocks: [
            { type: "paragraph", content: [styledText("In scope", "bold")] },
            {
              type: "bulletListItem",
              content: [
                plain("The "),
                styledText("price_lookup()", "code"),
                plain(" call, "),
                styledText("cached", "bold"),
                plain(" per market"),
              ],
              children: [],
            },
            bullet("Mobile checkout"),
            {
              type: "paragraph",
              content: [styledText("Out of scope", "bold")],
            },
            bullet("The payment page"),
          ],
        },
      ],
      literal: false,
    });
  });

  it("reads a numbered item with a nested bullet, a checklist, a subheading, a quote, a code fence and a table", () => {
    expect(
      readProse([
        "#### Details",
        "1. measure",
        "   - per market",
        "- [x] flag exists",
        "- [ ] rollout plan",
        "",
        "> Latency is the product.",
        "",
        "```sql",
        "## not a section",
        "```",
        "| Market | p95 |",
        "| --- | --- |",
        "| DE | 200 ms |",
      ]),
    ).toEqual([
      { type: "heading", level: 3, content: [plain("Details")] },
      {
        type: "numberedListItem",
        content: [plain("measure")],
        children: [bullet("per market")],
      },
      {
        type: "checkListItem",
        checked: true,
        content: [plain("flag exists")],
        children: [],
      },
      {
        type: "checkListItem",
        checked: false,
        content: [plain("rollout plan")],
        children: [],
      },
      { type: "quote", content: [plain("Latency is the product.")] },
      {
        type: "codeBlock",
        language: "sql",
        content: [plain("## not a section")],
      },
      {
        type: "table",
        rows: [
          [[plain("Market")], [plain("p95")]],
          [[plain("DE")], [plain("200 ms")]],
        ],
      },
    ]);
  });

  it("keeps a question fence a plan entity while a js fence beside it is code", () => {
    expect(
      scopeOps([
        "```js",
        "lookup();",
        "```",
        "",
        "```question",
        '{"question": "Which flag?"}',
        "```",
      ]),
    ).toMatchObject([
      {
        op: "set-section-prose",
        blocks: [
          { type: "codeBlock", language: "js", content: [plain("lookup();")] },
        ],
      },
      { op: "add-question", slot: "scope", question: "Which flag?" },
    ]);
  });

  it("reads a quote as prose while a quoted question and answer stay conversation", () => {
    expect(
      scopeOps([
        "> **Question** (q-flag): Which flag?",
        "> **Answer**: beta",
        "",
        "> Germany is the biggest market.",
      ]),
    ).toEqual([
      {
        op: "set-section-prose",
        slot: "scope",
        blocks: [
          { type: "quote", content: [plain("Germany is the biggest market.")] },
        ],
      },
    ]);
  });

  it("nests bullets three levels deep by their indentation", () => {
    expect(readProse(["- a", "  - b", "    - c", "- d"])).toEqual([
      bullet("a", [bullet("b", [bullet("c")])]),
      bullet("d"),
    ]);
  });

  it("joins an item's continuation lines and reads an indented paragraph after a blank line as its child", () => {
    expect(
      readProse(["- first", "  still first", "", "  a paragraph"]),
    ).toEqual([
      {
        type: "bulletListItem",
        content: [plain("first\nstill first")],
        children: [{ type: "paragraph", content: [plain("a paragraph")] }],
      },
    ]);
  });

  it("reads # and ###### headings as level 3 subheadings", () => {
    expect(readProse(["# Top", "###### Deep"])).toEqual([
      { type: "heading", level: 3, content: [plain("Top")] },
      { type: "heading", level: 3, content: [plain("Deep")] },
    ]);
  });

  it("reads an escaped pipe in a table cell as a pipe and pads a short row", () => {
    expect(readProse(["| a \\| b | c |", "|---|:-:|", "| **x** |"])).toEqual([
      {
        type: "table",
        rows: [
          [[plain("a | b")], [plain("c")]],
          [[styledText("x", "bold")], []],
        ],
      },
    ]);
  });

  it("reads a fence without a language as text code, and an unclosed one to the end", () => {
    expect(readProse(["```", "a", "```", "", "````js", "b", "```"])).toEqual([
      { type: "codeBlock", language: "text", content: [plain("a")] },
      { type: "codeBlock", language: "js", content: [plain("b\n```")] },
    ]);
  });

  it("reads a paragraph's lines up to the list that interrupts it", () => {
    expect(readProse(["Two things:", "- one"])).toEqual([
      { type: "paragraph", content: [plain("Two things:")] },
      bullet("one"),
    ]);
  });
});
