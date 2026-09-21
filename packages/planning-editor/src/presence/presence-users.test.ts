import { describe, it, expect } from "vitest";

import { presenceUsers, type AwarenessState } from "./presence-users.js";

const ANA_STATE: AwarenessState = {
  user: { name: "Ana", color: "#d33682" },
  editing: { slot: "kpis" },
};

const states = (entries: [number, AwarenessState][]) =>
  new Map<number, AwarenessState>(entries);

describe("presenceUsers", () => {
  it("lists Ana in kpis and leaves out the viewer's own client 1", () => {
    const both = states([
      [1, { user: { name: "Ben", color: "#268bd2" } }],
      [2, ANA_STATE],
    ]);
    expect(presenceUsers(both, 1)).toEqual([
      { clientId: 2, name: "Ana", color: "#d33682", slot: "kpis" },
    ]);
  });

  it("leaves out a client that has not announced a user yet", () => {
    expect(presenceUsers(states([[3, {}]]), 1)).toEqual([]);
  });

  it("gives Ana no section before she has placed her cursor", () => {
    const withoutCursor = states([[2, { user: ANA_STATE.user }]]);
    expect(presenceUsers(withoutCursor, 1)).toMatchObject([
      { name: "Ana", slot: null },
    ]);
  });
});
