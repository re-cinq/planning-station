import { describe, it, expect } from "vitest";

import { assignColors, PALETTE, type ColorClaim } from "./palette.js";

const peer = (
  clientId: number,
  userId: string,
  extra: Partial<ColorClaim> = {},
): ColorClaim => ({ clientId, userId, joinedAt: clientId, ...extra });

const linear = (channel: number) =>
  channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const contrastWithWhite = (hex: string) => {
  const [red, green, blue] = [1, 3, 5].map((start) =>
    linear(parseInt(hex.slice(start, start + 2), 16) / 255),
  );
  const luminance = 0.2126 * red! + 0.7152 * green! + 0.0722 * blue!;

  return 1.05 / (luminance + 0.05);
};

describe("PALETTE", () => {
  it("holds 50 distinct #rrggbb colors", () => {
    expect({
      size: new Set(PALETTE).size,
      hex: PALETTE.every((color) => /^#[0-9a-f]{6}$/.test(color)),
    }).toEqual({ size: 50, hex: true });
  });

  it("gives every color at least 4.5:1 contrast with white label text", () => {
    expect(PALETTE.filter((color) => contrastWithWhite(color) < 4.5)).toEqual(
      [],
    );
  });
});

describe("assignColors", () => {
  it("gives Ana, Ben and Cleo the first three palette colors in the order they joined", () => {
    const colors = assignColors([
      peer(7, "cleo", { joinedAt: 30 }),
      peer(9, "ana", { joinedAt: 10 }),
      peer(3, "ben", { joinedAt: 20 }),
    ]);
    expect(Object.fromEntries(colors)).toEqual({
      ana: PALETTE[0],
      ben: PALETTE[1],
      cleo: PALETTE[2],
    });
  });

  it("gives Ana one color across her two tabs", () => {
    const colors = assignColors([
      peer(1, "ana"),
      peer(2, "ben"),
      peer(3, "ana"),
    ]);
    expect(Object.fromEntries(colors)).toEqual({
      ana: PALETTE[0],
      ben: PALETTE[1],
    });
  });

  it("orders two people who joined at the same moment by client id", () => {
    const colors = assignColors([
      peer(8, "ben", { joinedAt: 10 }),
      peer(4, "ana", { joinedAt: 10 }),
    ]);
    expect(Object.fromEntries(colors)).toEqual({
      ana: PALETTE[0],
      ben: PALETTE[1],
    });
  });

  it("lets Ben keep his second color after Ana, who joined before him, leaves", () => {
    const colors = assignColors([
      peer(2, "ben", { color: PALETTE[1] }),
      peer(3, "cleo", { color: PALETTE[2] }),
    ]);
    expect(Object.fromEntries(colors)).toEqual({
      ben: PALETTE[1],
      cleo: PALETTE[2],
    });
  });

  it("moves Cleo off the color Ana, who joined first, already holds", () => {
    const colors = assignColors([
      peer(1, "ana", { color: PALETTE[0] }),
      peer(3, "cleo", { color: PALETTE[0] }),
    ]);
    expect(colors.get("cleo")).toBe(PALETTE[1]);
  });

  it("gives Cleo, arriving with a clock behind Ana's and Ben's, the third color and leaves theirs alone", () => {
    const colors = assignColors([
      peer(1, "ana", { joinedAt: 10, color: PALETTE[0] }),
      peer(2, "ben", { joinedAt: 20, color: PALETTE[1] }),
      peer(3, "cleo", { joinedAt: 5 }),
    ]);
    expect(Object.fromEntries(colors)).toEqual({
      ana: PALETTE[0],
      ben: PALETTE[1],
      cleo: PALETTE[2],
    });
  });

  it("replaces a color outside the palette with the first free one", () => {
    const colors = assignColors([
      peer(1, "ana", { color: "hsl(120 65% 45%)" }),
    ]);
    expect(colors.get("ana")).toBe(PALETTE[0]);
  });

  it("wraps to the first color for the 51st person", () => {
    const peers = [...Array(51).keys()].map((index) =>
      peer(index, `user-${index}`),
    );
    expect(assignColors(peers).get("user-50")).toBe(PALETTE[0]);
  });
});
