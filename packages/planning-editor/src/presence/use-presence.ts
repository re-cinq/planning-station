import { useEffect, useState } from "react";
import type { Awareness } from "y-protocols/awareness";

import { slotAt, type MenuBlock } from "../menu/section-context.js";
import type { PlanBlockNoteEditor } from "../schema/block-bridge.js";
import { presenceUsers, type PresenceUser } from "./presence-users.js";

export function usePresence(awareness: Awareness): PresenceUser[] {
  const [users, setUsers] = useState(() => readUsers(awareness));

  useEffect(() => {
    const update = () => setUsers(readUsers(awareness));
    awareness.on("change", update);
    update();

    return () => awareness.off("change", update);
  }, [awareness]);

  return users;
}

export function useTrackEditing(
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
