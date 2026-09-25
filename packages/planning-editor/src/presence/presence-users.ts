import { findSectionSlot, type PlanTemplate } from "@re-cinq/planning-document";

import { PALETTE, type ColorClaim } from "./palette.js";

export interface PresenceUser {
  clientId: number;
  /** The person, shared by all their tabs; a peer that announced none is its client. */
  id: string;
  name: string;
  color: string;
  slot: string | null;
  /** Whether the person has placed a cursor in the document, which is when the entry offers to scroll to it. */
  hasCursor: boolean;
}

interface AnnouncedUser {
  id?: unknown;
  name?: unknown;
  color?: unknown;
  joinedAt?: unknown;
}

export interface AwarenessState {
  user?: AnnouncedUser;
  editing?: { slot?: unknown };
  /** Set by the editor's collaboration cursor plugin once a selection exists. */
  cursor?: unknown;
}

export function presenceUsers(
  states: ReadonlyMap<number, AwarenessState>,
  selfId: number,
): PresenceUser[] {
  return [...states].flatMap(([clientId, state]) =>
    clientId === selfId || !state.user ? [] : [toPresence(clientId, state)],
  );
}

function toPresence(
  clientId: number,
  { user = {}, editing, cursor }: AwarenessState,
): PresenceUser {
  return {
    clientId,
    id: idOf(clientId, user),
    name: String(user.name ?? "Someone"),
    color: String(user.color ?? PALETTE[0]),
    slot: slotOf(editing),
    hasCursor: cursor != null,
  };
}

/** Everyone's claim on a color, the viewer's own included, so every client settles on the same assignment. */
export function colorClaims(
  states: ReadonlyMap<number, AwarenessState>,
): ColorClaim[] {
  return [...states].flatMap(([clientId, { user }]) =>
    user ? [toClaim(clientId, user)] : [],
  );
}

function toClaim(clientId: number, user: AnnouncedUser): ColorClaim {
  return {
    clientId,
    userId: idOf(clientId, user),
    joinedAt:
      typeof user.joinedAt === "number"
        ? user.joinedAt
        : Number.MAX_SAFE_INTEGER,
    color: typeof user.color === "string" ? user.color : undefined,
  };
}

function idOf(clientId: number, user: AnnouncedUser): string {
  return typeof user.id === "string" && user.id ? user.id : String(clientId);
}

function slotOf(editing: AwarenessState["editing"]): string | null {
  const slot = editing?.slot;

  return typeof slot === "string" ? slot : null;
}

/** "Ana in Success criteria": the section is resolved like the editor's own, so one the agent added reads by its title. */
export function presenceLabel(
  user: PresenceUser,
  template: PlanTemplate,
  titles: ReadonlyMap<string, string>,
): string {
  const section =
    user.slot && findSectionSlot(template, user.slot, titles.get(user.slot));

  return section ? `${user.name} in ${section.title}` : user.name;
}
