import { createExtension } from "@blocknote/core";
import type { PlanChange } from "@re-cinq/planning-document";
import { changesIn } from "@re-cinq/planning-yjs";
import type { Node } from "prosemirror-model";
import { Plugin, PluginKey, type EditorState } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import type { Doc } from "yjs";

export const CHANGE_WIDGETS = new PluginKey("planChangeWidgets");

import type { ChangeHosts } from "../blocks/change-hosts.js";

export type { ChangeHosts };

/** Draws an empty element after the paragraph each proposed change is about. ProseMirror owns the editor's DOM and strips anything put there by hand, so a change is a widget decoration — the one way to hang something between two blocks and have it stay. */
export function changeWidgets(doc: Doc, hosts: ChangeHosts) {
  return createExtension({
    key: "planChangeWidgets",
    prosemirrorPlugins: [
      new Plugin({
        key: CHANGE_WIDGETS,
        props: {
          decorations: (state: EditorState) =>
            DecorationSet.create(state.doc, widgets(state, doc, hosts)),
        },
      }),
    ],
  });
}

function widgets(
  state: EditorState,
  doc: Doc,
  hosts: ChangeHosts,
): Decoration[] {
  const ends = blockEnds(state);

  return changesIn(doc).flatMap((change) => {
    const at = ends.get(change.anchorId ?? "");

    return at === undefined ? [] : [widget(at, change, hosts)];
  });
}

function widget(
  at: number,
  change: PlanChange,
  hosts: ChangeHosts,
): Decoration {
  return Decoration.widget(at, () => host(change.changeId, hosts), {
    side: 1,
    key: change.changeId,
  });
}

function host(changeId: string, hosts: ChangeHosts): HTMLElement {
  const kept = hosts.get(changeId);

  if (kept) {
    return kept;
  }

  const element = document.createElement("div");
  element.dataset["changeId"] = changeId;
  hosts.set(changeId, element);

  return element;
}

/** Where each block ends, by the id it carries: the position a change about it hangs at. */
function blockEnds(state: EditorState): Map<string, number> {
  const ends = new Map<string, number>();
  state.doc.descendants((node: Node, pos: number) => {
    const id = String(node.attrs["id"] ?? "");

    // The outermost node wins: a block and the content inside it carry the same id, and a change hangs after the whole block, never inside its text.
    if (id && !ends.has(id)) {
      ends.set(id, pos + node.nodeSize);
    }

    return true;
  });

  return ends;
}
