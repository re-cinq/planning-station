import { describe, it, expect } from "vitest";
import { PLAN_FRAGMENT } from "@re-cinq/planning-document";
import { readBlocks, toBase64 } from "@re-cinq/planning-yjs";
import { Doc, encodeStateAsUpdate, XmlText } from "yjs";

import { planSeed } from "../testing/fixtures.js";
import { createMemoryHub } from "./memory-hub.js";
import type { InboundPlanEvent, PlanTransport } from "./plan-events.js";

const SEED = planSeed("feature");

const listen = (transport: PlanTransport) => {
  const received: InboundPlanEvent[] = [];
  transport.subscribe((event) => received.push(event));

  return received;
};

const oneEdit = () => {
  const doc = new Doc();
  doc.getXmlFragment("scratch").insert(0, [new XmlText("edit")]);

  return toBase64(encodeStateAsUpdate(doc));
};

const fragmentLength = (doc: Doc, name: string) =>
  doc.getXmlFragment(name).length;

describe("createMemoryHub", () => {
  it("greets a new peer with the seeded document and the plan meta", () => {
    const hub = createMemoryHub(SEED);
    const [greeting] = listen(hub.connect());
    expect(greeting).toMatchObject({ type: "document", meta: SEED.meta });
  });

  it("seeds its document with the plan's section headings", () => {
    expect(readBlocks(createMemoryHub(SEED).doc)).toHaveLength(
      SEED.blocks.length,
    );
  });

  it("relays Ana's update to Ben but not back to Ana", () => {
    const hub = createMemoryHub(SEED);
    const ana = hub.connect();
    const toAna = listen(ana);
    const toBen = listen(hub.connect());
    ana.send({ type: "update", update: oneEdit() });
    expect([toAna.length, toBen.map((event) => event.type)]).toEqual([
      1,
      ["document", "update"],
    ]);
  });

  it("keeps the edit in its own document for the next peer", () => {
    const { doc, connect } = createMemoryHub(SEED);
    connect().send({ type: "update", update: oneEdit() });
    expect(fragmentLength(doc, "scratch")).toEqual(1);
  });

  it("stops delivering to a peer that unsubscribed", () => {
    const hub = createMemoryHub(SEED);
    const received: InboundPlanEvent[] = [];
    const unsubscribe = hub
      .connect()
      .subscribe((event) => received.push(event));
    unsubscribe();
    hub.connect().send({ type: "update", update: oneEdit() });
    expect(received.map((event) => event.type)).toEqual(["document"]);
  });

  it("leaves the plan fragment untouched by unrelated edits", () => {
    const { doc, connect } = createMemoryHub(SEED);
    const before = fragmentLength(doc, PLAN_FRAGMENT);
    connect().send({ type: "update", update: oneEdit() });
    expect(fragmentLength(doc, PLAN_FRAGMENT)).toEqual(before);
  });
});
