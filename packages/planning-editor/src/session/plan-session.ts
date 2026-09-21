import type { PlanMeta } from "@re-cinq/planning-document";
import { fromBase64, toBase64 } from "@re-cinq/planning-yjs";
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
import { applyUpdate, Doc } from "yjs";

import { changedClients, type AwarenessChange } from "./awareness-change.js";
import type {
  InboundPlanEvent,
  PlanTransport,
  TransportStatus,
} from "./plan-events.js";

export const REMOTE = "plan-transport";

export type SessionStatus = TransportStatus | "ready";

export interface SessionState {
  status: SessionStatus;
  meta: PlanMeta | null;
  reason?: string;
}

export interface PlanSession {
  doc: Doc;
  awareness: Awareness;
  state(): SessionState;
  onState(listener: () => void): () => void;
  destroy(): void;
}

interface Replica {
  doc: Doc;
  awareness: Awareness;
}

export function createPlanSession(transport: PlanTransport): PlanSession {
  const doc = new Doc();
  const replica = { doc, awareness: new Awareness(doc) };
  const store = createStore({ status: "connecting", meta: null });
  forwardLocalChanges(replica, transport);
  const unsubscribe = transport.subscribe((event) =>
    applyInbound({ ...replica, store }, event),
  );

  return {
    ...replica,
    state: store.get,
    onState: store.listen,
    destroy: () => closeReplica(replica, unsubscribe),
  };
}

function closeReplica({ doc, awareness }: Replica, unsubscribe: () => void) {
  awareness.setLocalState(null);
  unsubscribe();
  awareness.destroy();
  doc.destroy();
}

interface Store {
  get(): SessionState;
  set(patch: Partial<SessionState>): void;
  listen(listener: () => void): () => void;
}

function createStore(initial: SessionState): Store {
  let current = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => current,
    set: (patch) => {
      current = { ...current, ...patch };
      listeners.forEach((listener) => listener());
    },
    listen: (listener) => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
  };
}

type Target = Replica & { store: Store };

const INBOUND: {
  [K in InboundPlanEvent["type"]]: (
    target: Target,
    event: Extract<InboundPlanEvent, { type: K }>,
  ) => void;
} = {
  document: ({ doc, store }, { state, meta }) => {
    applyUpdate(doc, fromBase64(state), REMOTE);
    store.set({ status: "ready", meta });
  },
  update: ({ doc }, { update }) => applyUpdate(doc, fromBase64(update), REMOTE),
  awareness: ({ awareness }, { update }) =>
    applyAwarenessUpdate(awareness, fromBase64(update), REMOTE),
  meta: ({ store }, { meta }) => store.set({ meta }),
  status: ({ store }, { status, reason }) => store.set({ status, reason }),
};

function applyInbound(target: Target, event: InboundPlanEvent): void {
  (INBOUND[event.type] as (target: Target, event: InboundPlanEvent) => void)(
    target,
    event,
  );
}

function forwardLocalChanges(
  { doc, awareness }: Replica,
  transport: PlanTransport,
): void {
  doc.on("update", (update: Uint8Array, origin: unknown) => {
    if (origin !== REMOTE) {
      transport.send({ type: "update", update: toBase64(update) });
    }
  });
  awareness.on("update", (change: AwarenessChange, origin: unknown) => {
    if (origin === REMOTE) {
      return;
    }

    const update = encodeAwarenessUpdate(awareness, changedClients(change));
    transport.send({ type: "awareness", update: toBase64(update) });
  });
}
