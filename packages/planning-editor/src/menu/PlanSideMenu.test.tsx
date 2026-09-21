import { afterEach, describe, expect, it } from "vitest";

import { firstLineCentre } from "./PlanSideMenu.js";

function mounted(html: string): Element {
  const block = document.createElement("div");
  block.innerHTML = html;
  document.body.append(block);

  return block;
}

afterEach(() => document.body.replaceChildren());

describe("firstLineCentre", () => {
  it("returns 55 for a 30px line under 40px of padding", () => {
    const block = mounted(
      '<header style="padding-top: 40px; font: 20px/30px sans-serif"><h2 style="margin: 0; font: inherit">Why</h2></header>',
    );

    expect(firstLineCentre(block)).toBeCloseTo(55, 0);
  });

  it("returns 17 for an empty 24px line under 5px of padding", () => {
    const block = mounted(
      '<div style="padding-top: 5px"><p class="bn-inline-content" style="margin: 0; line-height: 24px"></p></div>',
    );

    expect(firstLineCentre(block)).toBe(17);
  });

  it("returns null when the block has no line of text", () => {
    expect(firstLineCentre(mounted("<hr>"))).toBeNull();
  });
});
