export interface PresenceUser {
  clientId: number;
  name: string;
  color: string;
  slot: string | null;
}

interface AnnouncedUser {
  name?: unknown;
  color?: unknown;
}

export interface AwarenessState {
  user?: AnnouncedUser;
  editing?: { slot?: unknown };
}

export function presenceUsers(
  states: ReadonlyMap<number, AwarenessState>,
  selfId: number,
): PresenceUser[] {
  return [...states].flatMap(([clientId, { user, editing }]) =>
    clientId === selfId || !user ? [] : [toPresence(clientId, user, editing)],
  );
}

function toPresence(
  clientId: number,
  user: AnnouncedUser,
  editing: AwarenessState["editing"],
): PresenceUser {
  return {
    clientId,
    name: String(user.name ?? "Someone"),
    color: String(user.color ?? "gray"),
    slot: slotOf(editing),
  };
}

function slotOf(editing: AwarenessState["editing"]): string | null {
  const slot = editing?.slot;

  return typeof slot === "string" ? slot : null;
}
