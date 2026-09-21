import type { PlanMeta } from "@re-cinq/planning-document";

export interface PlanUser {
  id: string;
  name: string;
  color: string;
}

export type TransportStatus = "connecting" | "disconnected" | "denied";

// Yjs payloads travel as base64 so any transport can carry the events as JSON.
export type InboundPlanEvent =
  | { type: "document"; meta: PlanMeta; state: string }
  | { type: "update"; update: string }
  | { type: "awareness"; update: string }
  | { type: "meta"; meta: PlanMeta }
  | { type: "status"; status: TransportStatus; reason?: string };

export type OutboundPlanEvent =
  { type: "update"; update: string } | { type: "awareness"; update: string };

export type InboundHandler = (event: InboundPlanEvent) => void;

export interface PlanTransport {
  send(event: OutboundPlanEvent): void;
  subscribe(handler: InboundHandler): () => void;
}
