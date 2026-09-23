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
  const places = blockPlaces(state);

  return changesIn(doc).flatMap((change) => {
    const at = placeOf(places, change);

    return at === undefined ? [] : [widget(at, change, hosts)];
  });
}

/** Where a change hangs: after the paragraph it is about, or — for one about no paragraph of its own, like a question it asks — at the end of its section, before the section's own actions. */
function placeOf(places: Places, change: PlanChange): number | undefined {
  return change.anchorId
    ? places.ends.get(change.anchorId)
    : places.starts.get(`actions-${change.slot}`);
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

interface Places {
  /** Where each block ends: the position a change about it hangs at. */
  ends: Map<string, number>;
  /** Where each block starts: the position a change hangs BEFORE it at. */
  starts: Map<string, number>;
}

/** Each block's place, by the id it carries. The outermost node wins: a block and the content inside it carry the same id, and a change hangs around the whole block, never inside its text. */
function blockPlaces(state: EditorState): Places {
  const places: Places = { ends: new Map(), starts: new Map() };
  state.doc.descendants((node: Node, pos: number) => {
    const id = String(node.attrs["id"] ?? "");

    if (id && !places.ends.has(id)) {
      places.ends.set(id, pos + node.nodeSize);
      places.starts.set(id, pos);
    }

    return true;
  });

  return places;
}
