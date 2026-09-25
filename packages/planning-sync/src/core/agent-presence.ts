import type { Hocuspocus } from "@hocuspocus/server";
import { enforceTrue } from "@re-cinq/planning-document";

import { openPlanConnection, type PlanConnection } from "./plan-connection.js";
import type { PlanningService } from "./planning-service.js";

export interface PresenceUser {
  name: string;
  color: string;
}

export interface PresenceRequest {
  planId: string;
  user: PresenceUser;
}

export interface EditingRequest {
  planId: string;
  slot: string | null;
}

export interface PresenceOptions {
  service: PlanningService;
  collab: Hocuspocus;
}

/** The agent shown on a plan to every viewer, over one connection it holds open until it leaves. */
export interface AgentPresence {
  open(request: PresenceRequest): Promise<void>;
  setEditing(request: EditingRequest): Promise<void>;
  close(request: { planId: string }): Promise<void>;
  /** The connection the agent holds on the plan, while it is present there. */
  heldConnection(planId: string): PlanConnection | undefined;
}

type Awareness = NonNullable<PlanConnection["document"]>["awareness"];

interface HeldPresence {
  connection: PlanConnection;
  awareness: Awareness;
}

type PresenceByPlan = Map<string, HeldPresence>;

export function createAgentPresence(options: PresenceOptions): AgentPresence {
  const presences: PresenceByPlan = new Map();

  return {
    open: (request) => open(options, presences, request),
    setEditing: async (request) => setEditing(presences, request),
    close: (request) => close(presences, request.planId),
    heldConnection: (planId) => presences.get(planId)?.connection,
  };
}

async function open(
  options: PresenceOptions,
  presences: PresenceByPlan,
  { planId, user }: PresenceRequest,
): Promise<void> {
  const { json } = await options.service.readPlan(planId);
  const connection = await openPlanConnection(options.collab, json);
  const document = connection.document;

  enforceTrue(
    document !== null,
    Error,
    `no document to broadcast presence on for plan ${planId}`,
  );
  presences.set(planId, { connection, awareness: document.awareness });
  document.awareness.setLocalState({ user, editing: { slot: null } });
}

function setEditing(
  presences: PresenceByPlan,
  { planId, slot }: EditingRequest,
): void {
  const held = presences.get(planId);

  held?.awareness.setLocalStateField("editing", { slot });
}

async function close(presences: PresenceByPlan, planId: string): Promise<void> {
  const held = presences.get(planId);
  if (!held) return;

  held.awareness.setLocalState(null);
  await held.connection.disconnect();
  presences.delete(planId);
}
