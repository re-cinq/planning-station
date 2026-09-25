import { useEffect, useRef, useState } from "react";
import type { Awareness } from "y-protocols/awareness";

import { slotAt, type MenuBlock } from "../menu/section-context.js";
import type { PlanBlockNoteEditor } from "../schema/block-bridge.js";
import { assignColors } from "./palette.js";
import { paintPeers } from "./peer-cursor.js";
import {
  colorClaims,
  presenceUsers,
  type AwarenessState,
  type PresenceUser,
} from "./presence-users.js";

export function usePresence(awareness: Awareness): PresenceUser[] {
  const [users, setUsers] = useState(() => readUsers(awareness));
  useOnAwareness(awareness, () => setUsers(readUsers(awareness)));

  return users;
}

/** Everything this client shares with the others on the plan: where it is editing, its color, and theirs on its screen. */
export function useSharedPresence(
  editor: PlanBlockNoteEditor,
  awareness: Awareness,
): void {
  useTrackEditing(editor, awareness);
  useOwnColor(awareness);
  usePeerColors(editor, awareness);
}

/** Announces the color this client settles on with everyone else here, so no two people share one. */
function useOwnColor(awareness: Awareness): void {
  useOnAwareness(awareness, () => {
    const own = ownUser(awareness);
    const color = own && settledColor(awareness, own.id);

    if (own && color && color !== own.color) {
      awareness.setLocalStateField("user", { ...own, color });
    }
  });
}

/** Keeps every peer's caret in the color they announce now. */
function usePeerColors(
  editor: PlanBlockNoteEditor,
  awareness: Awareness,
): void {
  useOnAwareness(awareness, () => {
    const root = editor.domElement;

    if (root) {
      paintPeers(root, readUsers(awareness));
    }
  });
}

/** Runs now and on every awareness change, until the awareness or listener goes. */
function useOnAwareness(awareness: Awareness, listener: () => void): void {
  const latest = useRef(listener);
  latest.current = listener;

  useEffect(() => {
    const run = () => latest.current();
    awareness.on("change", run);
    run();

    return () => awareness.off("change", run);
  }, [awareness]);
}

function ownUser(
  awareness: Awareness,
): { id: string; color?: unknown } | undefined {
  const user = (awareness.getLocalState() as AwarenessState | null)?.user;

  return user && { ...user, id: String(user.id ?? awareness.clientID) };
}

function settledColor(awareness: Awareness, id: string): string | undefined {
  return assignColors(colorClaims(awareness.getStates())).get(id);
}

function useTrackEditing(
  editor: PlanBlockNoteEditor,
  awareness: Awareness,
): void {
  useEffect(
    () =>
      editor.onSelectionChange(() => {
        const { block } = editor.getTextCursorPosition();
        const blocks = editor.document as readonly MenuBlock[];
        awareness.setLocalStateField("editing", {
          slot: slotAt(blocks, block.id),
        });
      }),
    [editor, awareness],
  );
}

function readUsers(awareness: Awareness): PresenceUser[] {
  return presenceUsers(awareness.getStates(), awareness.clientID);
}
