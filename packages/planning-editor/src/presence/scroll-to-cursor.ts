import type { EditorView } from "prosemirror-view";
import { yCursorPluginKey } from "y-prosemirror";

import type { PlanBlockNoteEditor } from "../schema/block-bridge.js";

interface CursorDecoration {
  from: number;
  spec: { key?: unknown };
}

interface CursorDecorations {
  find(
    start?: number,
    end?: number,
    predicate?: (spec: CursorDecoration["spec"]) => boolean,
  ): CursorDecoration[];
}

/** Brings a participant's cursor into view: the cursor plugin already places one widget per remote client, keyed by client id, so its position is read off that decoration instead of resolving the relative position a second time. */
export function scrollToCursor(
  editor: PlanBlockNoteEditor,
  clientId: number,
): void {
  const view = editor.prosemirrorView;
  const position = cursorPosition(view, clientId);

  if (position !== null) {
    elementAt(view, position)?.scrollIntoView({ block: "center" });
  }
}

function cursorPosition(view: EditorView, clientId: number): number | null {
  const decorations = yCursorPluginKey.getState(view.state) as
    CursorDecorations | undefined;
  const [widget] =
    decorations?.find(
      undefined,
      undefined,
      (spec) => spec.key === String(clientId),
    ) ?? [];

  return widget?.from ?? null;
}

function elementAt(view: EditorView, position: number): Element | null {
  const { node } = view.domAtPos(position);

  return node instanceof Element ? node : node.parentElement;
}
