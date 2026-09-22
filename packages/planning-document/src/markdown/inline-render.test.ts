import { describe, it, expect } from "vitest";

import type { InlineContent } from "../blocks/inline-text.js";
import { parseInline } from "./inline-parse.js";
import { canonicalInline, renderInline } from "./inline-render.js";

const plain = (text: string) => ({ type: "text" as const, text, styles: {} });

const styled = (text: string, ...styles: string[]) => ({
  type: "text" as const,
  text,
  styles: Object.fromEntries(styles.map((style) => [style, true])),
});

const ROUND_TRIPS: InlineContent[] = [
  [styled("a", "bold"), styled("b", "italic")],
  [styled("a", "bold", "italic"), styled("b", "italic")],
  [styled("a", "italic"), styled("b", "bold", "italic"), plain("c")],
  [styled("x", "bold"), styled("price()", "bold", "code"), styled("y", "bold")],
  [plain("a "), styled("gone", "strike"), plain("~5 ms")],
  [
    styled("see", "bold"),
    {
      type: "link",
      href: "https://example.com/a(b)",
      content: [plain("the "), styled("[ADR]", "italic")],
    },
    styled("now", "bold"),
  ],
  [plain("* _ ` [ ] \\ ~~ ~ snake_case 2*3*4")],
  [styled("a ` tick", "code"), plain(" and "), styled("  ", "code")],
];

describe("renderInline", () => {
  it("writes bold, italic, strike, code and a link in their canonical form", () => {
    expect(
      renderInline([
        styled("In scope", "bold"),
        plain(" "),
        styled("slow", "italic"),
        plain(" "),
        styled("legacy", "strike"),
        plain(" "),
        styled("price()", "code"),
        plain(" "),
        { type: "link", href: "https://example.com", content: [plain("docs")] },
      ]),
    ).toEqual(
      "**In scope** *slow* ~~legacy~~ `price()` [docs](https://example.com)",
    );
  });

  it("escapes literal markers, but not an underscore inside a word", () => {
    expect(
      renderInline([plain("*a* [b] `c` \\ _d_ snake_case ~~e~~")]),
    ).toEqual("\\*a\\* \\[b] \\`c\\` \\\\ \\_d\\_ snake_case \\~\\~e\\~\\~");
  });

  it("moves spaces at the edge of a bold run outside its markers", () => {
    expect(
      renderInline([plain("a"), styled(" bold ", "bold"), plain("b")]),
    ).toEqual("a **bold** b");
  });

  it("reads every rendered sample back as the same nodes", () => {
    expect(
      ROUND_TRIPS.map((content) => parseInline(renderInline(content))),
    ).toEqual(ROUND_TRIPS.map(canonicalInline));
  });

  it("renders what it parsed canonically: __x__ and _y_ come back as **x** and *y*", () => {
    expect(renderInline(parseInline("__x__ and _y_ in a_b"))).toEqual(
      "**x** and *y* in a_b",
    );
  });
});
