import { describe, it, expect } from "vitest";

import { paintPeers } from "./peer-cursor.js";

const peer = (id: string, color: string) => ({
  clientId: 1,
  id,
  name: id,
  color,
  slot: null,
  hasCursor: true,
});

describe("paintPeers", () => {
  it("keeps the ids a.b and a_46b on two variables, each with its own color", () => {
    const root = document.createElement("div");
    paintPeers(root, [peer("a.b", "#c32222"), peer("a_46b", "#278643")]);
    const variables = [...root.style].filter((name) =>
      name.startsWith("--ps-peer-"),
    );
    expect(
      variables.map((name) => root.style.getPropertyValue(name)).sort(),
    ).toEqual(["#278643", "#c32222"]);
  });
});
