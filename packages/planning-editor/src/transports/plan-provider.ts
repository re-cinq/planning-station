import type { PlanMeta } from "@re-cinq/planning-document";
import { fromBase64, toBase64 } from "@re-cinq/planning-yjs";
import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  type Awareness,
} from "y-protocols/awareness";
import { applyUpdate, encodeStateAsUpdate, type Doc } from "yjs";

import {
  changedClients,
  type AwarenessChange,
} from "../session/awareness-change.js";
import type {
  InboundHandler,
  InboundPlanEvent,
  OutboundPlanEvent,
  PlanTransport,
} from "../session/plan-events.js";

/** What this transport needs of a provider; HocuspocusProvider has all of it. */
export interface PlanProvider {
  document: Doc;
  awareness: Awareness | null;
  synced: boolean;
  on(event: string, handler: (payload: never, origin: never) => void): void;
  destroy(): void;
}

export interface ProviderTransport extends PlanTransport {
  destroy(): void;
}

/** Marks what this transport wrote, so the provider's echo is not sent back. */
export const TRANSPORT_ORIGIN = "plan-transport";

export function transportFor(
  provider: PlanProvider,
  meta: PlanMeta,
): ProviderTransport {
  const handlers = new Set<InboundHandler>();
  const emit = (event: InboundPlanEvent) =>
    handlers.forEach((handler) => handler(event));
  relay(provider, meta, emit);

  return {
    send: (event) => receive(provider, event),
    subscribe: (handler) => {
      handlers.add(handler);
      greet(provider, meta, handler);

      return () => handlers.delete(handler);
    },
    destroy: () => provider.destroy(),
  };
}

function relay(
  provider: PlanProvider,
  meta: PlanMeta,
  emit: InboundHandler,
): void {
  relayStatus(provider, meta, emit);
  provider.document.on("update", (update: Uint8Array, origin: unknown) =>
    fromRemote(origin, () =>
      emit({ type: "update", update: toBase64(update) }),
    ),
  );
  provider.awareness?.on("update", (change: AwarenessChange, origin: unknown) =>
    fromRemote(origin, () => emit(awarenessEvent(provider, change))),
  );
}

function relayStatus(
  provider: PlanProvider,
  meta: PlanMeta,
  emit: InboundHandler,
): void {
  provider.on("synced", () => emit(documentEvent(provider.document, meta)));
  provider.on("authenticationFailed", ({ reason }: { reason: string }) =>
    emit({ type: "status", status: "denied", reason }),
  );
  provider.on("disconnect", () =>
    emit({ type: "status", status: "disconnected" }),
  );
}

function fromRemote(origin: unknown, emit: () => void): void {
  if (origin === TRANSPORT_ORIGIN) {
    return;
  }

  emit();
}

function receive(provider: PlanProvider, event: OutboundPlanEvent): void {
  if (event.type === "update") {
    applyUpdate(provider.document, fromBase64(event.update), TRANSPORT_ORIGIN);

    return;
  }

  const { awareness } = provider;

  if (awareness) {
    applyAwarenessUpdate(awareness, fromBase64(event.update), TRANSPORT_ORIGIN);
  }
}

function greet(
  provider: PlanProvider,
  meta: PlanMeta,
  handler: InboundHandler,
): void {
  if (!provider.synced) {
    return;
  }

  handler(documentEvent(provider.document, meta));
}

function documentEvent(doc: Doc, meta: PlanMeta): InboundPlanEvent {
  return { type: "document", meta, state: toBase64(encodeStateAsUpdate(doc)) };
}

function awarenessEvent(
  provider: PlanProvider,
  change: AwarenessChange,
): InboundPlanEvent {
  const { awareness } = provider;
  const update = encodeAwarenessUpdate(
    awareness as Awareness,
    changedClients(change),
  );

  return { type: "awareness", update: toBase64(update) };
}
