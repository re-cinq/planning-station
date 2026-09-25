import { describe, it, expect } from "vitest";

import { templateFor } from "@re-cinq/planning-document";

import {
  colorClaims,
  presenceLabel,
  presenceUsers,
  type AwarenessState,
} from "./presence-users.js";

const ANA_STATE: AwarenessState = {
  user: { id: "ana", name: "Ana", color: "#d33682", joinedAt: 10 },
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
      {
        clientId: 2,
        id: "ana",
        name: "Ana",
        color: "#d33682",
        slot: "kpis",
        hasCursor: false,
      },
    ]);
  });

  it("marks Ana as placed once her awareness carries a cursor", () => {
    const placed = states([
      [2, { ...ANA_STATE, cursor: { anchor: {}, head: {} } }],
    ]);
    expect(presenceUsers(placed, 1)).toMatchObject([{ hasCursor: true }]);
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

  it("keys a peer that announced no id by its client id", () => {
    const anonymous = states([[4, { user: { name: "Ana" } }]]);
    expect(presenceUsers(anonymous, 1)).toMatchObject([{ id: "4" }]);
  });
});

describe("colorClaims", () => {
  it("claims Ana's announced color, the viewer's own included, and skips a client with no user", () => {
    const all = states([
      [1, { user: { id: "ben", name: "Ben", joinedAt: 20 } }],
      [2, ANA_STATE],
      [3, {}],
    ]);
    expect(colorClaims(all)).toEqual([
      { clientId: 1, userId: "ben", joinedAt: 20, color: undefined },
      { clientId: 2, userId: "ana", joinedAt: 10, color: "#d33682" },
    ]);
  });

  it("puts a peer that announced no join time after everyone who did", () => {
    const legacy = states([[5, { user: { name: "Old" } }]]);
    expect(colorClaims(legacy)).toMatchObject([
      { userId: "5", joinedAt: Number.MAX_SAFE_INTEGER },
    ]);
  });
});

describe("presenceLabel", () => {
  const template = templateFor("feature");
  const ana = {
    clientId: 2,
    id: "ana",
    name: "Ana",
    color: "#d33682",
    slot: "kpis",
    hasCursor: true,
  };

  it("names the template section and the section the agent added that Ana is editing", () => {
    expect([
      presenceLabel(ana, template, new Map()),
      presenceLabel(
        { ...ana, slot: "custom-rollout" },
        template,
        new Map([["custom-rollout", "Rollout waves"]]),
      ),
      presenceLabel({ ...ana, slot: null }, template, new Map()),
    ]).toEqual(["Ana in Success criteria", "Ana in Rollout waves", "Ana"]);
  });
});
