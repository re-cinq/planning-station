import type { BlockJson, PlanMeta } from "@re-cinq/planning-document";
import { docFromBlocks, fromBase64, toBase64 } from "@re-cinq/planning-yjs";
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
import { applyUpdate, encodeStateAsUpdate, type Doc } from "yjs";

import { changedClients, type AwarenessChange } from "./awareness-change.js";
import type {
  InboundHandler,
  InboundPlanEvent,
  OutboundPlanEvent,
  PlanTransport,
} from "./plan-events.js";

export interface PlanSeed {
  meta: PlanMeta;
  blocks: readonly BlockJson[];
}

export interface MemoryHub {
  doc: Doc;
  connect(): PlanTransport;
}

interface Peer {
  handlers: Set<InboundHandler>;
}

interface Hub {
  doc: Doc;
  awareness: Awareness;
  meta: PlanMeta;
  peers: Set<Peer>;
}

export function createMemoryHub(seed: PlanSeed): MemoryHub {
  const doc = docFromBlocks(seed.blocks);
  const awareness = new Awareness(doc);
  awareness.setLocalState(null);
  const hub: Hub = { doc, awareness, meta: seed.meta, peers: new Set() };
  relay(hub);

  return { doc, connect: () => connectPeer(hub) };
}

export function localTransport(seed: PlanSeed): PlanTransport {
  return createMemoryHub(seed).connect();
}

function relay(hub: Hub): void {
  const { doc, awareness } = hub;
  doc.on("update", (update: Uint8Array, origin: unknown) =>
    broadcast(hub, origin, { type: "update", update: toBase64(update) }),
  );
  awareness.on("update", (change: AwarenessChange, origin: unknown) => {
    const update = encodeAwarenessUpdate(awareness, changedClients(change));
    broadcast(hub, origin, { type: "awareness", update: toBase64(update) });
  });
}

function broadcast(hub: Hub, origin: unknown, event: InboundPlanEvent): void {
  [...hub.peers]
    .filter((peer) => peer !== origin)
    .forEach((peer) => peer.handlers.forEach((handler) => handler(event)));
}

function connectPeer(hub: Hub): PlanTransport {
  const peer: Peer = { handlers: new Set() };
  hub.peers.add(peer);

  return {
    send: (event) => receive(hub, peer, event),
    subscribe: (handler) => {
      peer.handlers.add(handler);
      greet(hub, handler);

      return () => peer.handlers.delete(handler);
    },
  };
}

function receive(hub: Hub, peer: Peer, event: OutboundPlanEvent): void {
  if (event.type === "update") {
    applyUpdate(hub.doc, fromBase64(event.update), peer);

    return;
  }

  applyAwarenessUpdate(hub.awareness, fromBase64(event.update), peer);
}

function greet({ doc, awareness, meta }: Hub, handler: InboundHandler): void {
  const state = toBase64(encodeStateAsUpdate(doc));
  handler({ type: "document", meta, state });
  const clients = [...awareness.getStates().keys()];

  if (clients.length > 0) {
    const update = encodeAwarenessUpdate(awareness, clients);
    handler({ type: "awareness", update: toBase64(update) });
  }
}
