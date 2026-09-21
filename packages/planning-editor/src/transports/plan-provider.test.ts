import { describe, it, expect } from "vitest";
import { docFromBlocks, toBase64 } from "@re-cinq/planning-yjs";
import { planMeta, readyFeature } from "@re-cinq/planning-document/testing";
import { Awareness, encodeAwarenessUpdate } from "y-protocols/awareness";
import { Doc, encodeStateAsUpdate } from "yjs";

import type { InboundPlanEvent } from "../session/plan-events.js";
import { transportFor, type PlanProvider } from "./plan-provider.js";

const META = planMeta("feature");

type Listener = (payload: never, origin: never) => void;

interface FakeProvider extends PlanProvider {
  fire(event: string, payload?: unknown): void;
  destroyed: boolean;
}

const fakeProvider = (): FakeProvider => {
  const listeners = new Map<string, Listener[]>();
  const document = docFromBlocks(readyFeature());

  return {
    document,
    awareness: new Awareness(document),
    synced: false,
    destroyed: false,
    on: (event, handler) =>
      listeners.set(event, [...(listeners.get(event) ?? []), handler]),
    destroy(): void {
      this.destroyed = true;
    },
    fire: (event, payload) =>
      listeners
        .get(event)
        ?.forEach((handler) => handler(payload as never, undefined as never)),
  };
};

const listening = (provider: FakeProvider) => {
  const received: InboundPlanEvent[] = [];
  const transport = transportFor(provider, META);
  transport.subscribe((event) => received.push(event));

  return { transport, received };
};

const remoteUpdate = () => {
  const doc = new Doc();
  doc.getMap("typed").set("who", "ana");

  return toBase64(encodeStateAsUpdate(doc));
};

describe("transportFor", () => {
  it("sends the whole document with its plan meta once the provider synced", () => {
    const provider = fakeProvider();
    const { received } = listening(provider);
    provider.fire("synced");
    expect(received).toMatchObject([{ type: "document", meta: META }]);
  });

  it("greets a late subscriber with the document of an already synced provider", () => {
    const provider = fakeProvider();
    provider.synced = true;
    expect(listening(provider).received).toMatchObject([{ type: "document" }]);
  });

  it("passes a remote document change on as an update event", () => {
    const provider = fakeProvider();
    const { received } = listening(provider);
    remoteMap(provider).set("typed", "hi");
    expect(received.map((event) => event.type)).toEqual(["update"]);
  });

  it("does not echo back what the editor sent", () => {
    const provider = fakeProvider();
    const { transport, received } = listening(provider);
    transport.send({ type: "update", update: remoteUpdate() });
    expect(received).toEqual([]);
  });

  it("applies the editor's update to the provider's document", () => {
    const provider = fakeProvider();
    const { transport } = listening(provider);
    transport.send({ type: "update", update: remoteUpdate() });
    expect(typedMap(provider).get("who")).toEqual("ana");
  });

  it("applies the editor's awareness so the provider shares its cursor", () => {
    const provider = fakeProvider();
    const { transport } = listening(provider);
    transport.send({ type: "awareness", update: cursorOf() });
    expect(named(provider)).toMatchObject([{ user: { name: "Ana" } }]);
  });

  it("reports denied with the reason the server gave", () => {
    const provider = fakeProvider();
    const { received } = listening(provider);
    provider.fire("authenticationFailed", { reason: "permission-denied" });
    expect(received).toEqual([
      { type: "status", status: "denied", reason: "permission-denied" },
    ]);
  });

  it("reports disconnected when the socket drops", () => {
    const provider = fakeProvider();
    const { received } = listening(provider);
    provider.fire("disconnect");
    expect(received).toEqual([{ type: "status", status: "disconnected" }]);
  });

  it("destroys the provider when the host destroys the transport", () => {
    const provider = fakeProvider();
    listening(provider).transport.destroy();
    expect(provider.destroyed).toBe(true);
  });
});

const remoteMap = (provider: FakeProvider) =>
  provider.document.getMap("remote");
const typedMap = (provider: FakeProvider) => provider.document.getMap("typed");

function named(provider: FakeProvider) {
  const states = provider.awareness?.getStates() ?? new Map();

  return [...states.values()].filter((state) => state.user);
}

function cursorOf(): string {
  const awareness = new Awareness(new Doc());
  awareness.setLocalStateField("user", { name: "Ana", color: "#d33682" });
  const update = encodeAwarenessUpdate(awareness, [awareness.clientID]);
  awareness.destroy();

  return toBase64(update);
}
