import { describe, it, expect } from "vitest";

import { parseInline } from "./inline-parse.js";

const plain = (text: string) => ({ type: "text", text, styles: {} });

const styled = (text: string, ...styles: string[]) => ({
  type: "text",
  text,
  styles: Object.fromEntries(styles.map((style) => [style, true])),
});

describe("parseInline", () => {
  it("reads **In scope** and __In scope__ as bold", () => {
    expect([parseInline("**In scope**"), parseInline("__In scope__")]).toEqual([
      [styled("In scope", "bold")],
      [styled("In scope", "bold")],
    ]);
  });

  it("reads *slow* and _slow_ as italic inside a sentence", () => {
    expect([
      parseInline("a *slow* page"),
      parseInline("a _slow_ page"),
    ]).toEqual([
      [plain("a "), styled("slow", "italic"), plain(" page")],
      [plain("a "), styled("slow", "italic"), plain(" page")],
    ]);
  });

  it("reads `price_lookup()` as code without reading the underscore inside it", () => {
    expect(parseInline("call `**price_lookup()**`")).toEqual([
      plain("call "),
      styled("**price_lookup()**", "code"),
    ]);
  });

  it("reads ~~legacy~~ as struck through", () => {
    expect(parseInline("drop ~~legacy~~")).toEqual([
      plain("drop "),
      styled("legacy", "strike"),
    ]);
  });

  it("reads [the ADR](https://example.com/adr) as a link with bold text inside", () => {
    expect(parseInline("see [the **ADR**](https://example.com/adr)")).toEqual([
      plain("see "),
      {
        type: "link",
        href: "https://example.com/adr",
        content: [plain("the "), styled("ADR", "bold")],
      },
    ]);
  });

  it("reads ***both*** as bold and italic, and **a*b*** as bold a then bold italic b", () => {
    expect([parseInline("***both***"), parseInline("**a*b***")]).toEqual([
      [styled("both", "bold", "italic")],
      [styled("a", "bold"), styled("b", "bold", "italic")],
    ]);
  });

  it("keeps escaped markers as literal text", () => {
    expect(parseInline("\\*not italic\\* and \\[x\\](y) \\\\")).toEqual([
      plain("*not italic* and [x](y) \\"),
    ]);
  });

  it("keeps unbalanced and spaced markers literal", () => {
    expect(
      [
        "**open",
        "2 * 3 * 4",
        "snake_case_name",
        "`open code",
        "[text](no close",
        "~one~",
      ].map(parseInline),
    ).toEqual([
      [plain("**open")],
      [plain("2 * 3 * 4")],
      [plain("snake_case_name")],
      [plain("`open code")],
      [plain("[text](no close")],
      [plain("~one~")],
    ]);
  });

  it("strips the one space padding a code span holding a backtick", () => {
    expect(parseInline("`` `tick` ``")).toEqual([styled("`tick`", "code")]);
  });
});
