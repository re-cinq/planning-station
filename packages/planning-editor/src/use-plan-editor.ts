import { useCallback, useEffect, useMemo, useState } from "react";
import { withCollaboration } from "@blocknote/core/yjs";
import { useCreateBlockNote } from "@blocknote/react";
import {
  PLAN_FRAGMENT,
  type PlanDocument,
  type PlanMeta,
} from "@re-cinq/planning-document";
import { readBlocks } from "@re-cinq/planning-yjs";

import {
  projectBlocks,
  type PlanBlockNoteEditor,
} from "./schema/block-bridge.js";
import { planSchema } from "./schema/plan-schema.js";
import type { PlanUser } from "./session/plan-events.js";
import type { PlanSession } from "./session/plan-session.js";
import { templateGuard } from "./template/template-guard.js";

export interface PlanEditorOptions {
  session: PlanSession;
  meta: PlanMeta;
  user: PlanUser;
  onChange?: (plan: PlanDocument) => void;
}

export function usePlanEditor({
  session,
  meta,
  user,
  onChange,
}: PlanEditorOptions) {
  const editor = useCollaborativeEditor(session, user);
  const onEdit = useCallback(
    (document: readonly unknown[]) => onChange?.(projectBlocks(document, meta)),
    [meta, onChange],
  );
  const blocks = useEditedBlocks(editor, session, onEdit);
  const plan = useMemo(() => projectBlocks(blocks, meta), [blocks, meta]);

  return { editor, plan };
}

function useCollaborativeEditor(
  session: PlanSession,
  user: PlanUser,
): PlanBlockNoteEditor {
  const { doc } = session;

  return useCreateBlockNote(
    withCollaboration({
      schema: planSchema,
      extensions: [templateGuard],
      collaboration: {
        fragment: doc.getXmlFragment(PLAN_FRAGMENT),
        user: { ...user },
        provider: session,
      },
    }),
    [session],
  );
}

function useEditedBlocks(
  editor: PlanBlockNoteEditor,
  session: PlanSession,
  onEdit: (document: readonly unknown[]) => void,
): readonly unknown[] {
  const [blocks, setBlocks] = useState<readonly unknown[]>(() =>
    readBlocks(session.doc),
  );

  useEffect(
    () =>
      editor.onChange((changed) => {
        setBlocks(changed.document);
        onEdit(changed.document);
      }),
    [editor, onEdit],
  );

  return blocks;
}
