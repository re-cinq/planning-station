import { createExtension } from "@blocknote/core";
import { MARGIN_NOTES, SECTION_ACTIONS } from "@re-cinq/planning-document";
import type { Node } from "prosemirror-model";
import {
  NodeSelection,
  Plugin,
  TextSelection,
  type EditorState,
  type Selection,
  type Transaction,
} from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import { STRUCTURAL } from "./template-guard.js";
import { SECTION_HEADING, topBlocks, type TopBlock } from "./top-blocks.js";
import { IS_APPLE } from "./platform.js";

type Direction = "up" | "down";

/** Where a moved block goes: before the block at this position, nowhere at all, or one step as BlockNote moves it. */
type Landing = number | "nowhere" | "one-step";

const MOVE_KEYS: Readonly<Record<string, Direction>> = {
  ArrowUp: "up",
  ArrowDown: "down",
};

/** doc → blockGroup → blockContainer → content: a cursor deeper than the content sits in a nested block. */
const TEXT_DEPTH = 3;

/** A selected node one level up from the cursor: the content of a top-level block. A selected nested block sits deeper. */
const NODE_DEPTH = 2;

/** Moving a block with Mod-Shift-Arrow past a section's edge carries it over the section's actions, so it never lands under Refine. */
export const sectionMoves = createExtension({
  key: "planSectionMoves",
  prosemirrorPlugins: [
    new Plugin({ props: { handleKeyDown: movesAcrossSections } }),
  ],
});

export function movesAcrossSections(
  view: EditorView,
  event: KeyboardEvent,
): boolean {
  const direction = moveDirection(event);

  if (!direction) {
    return false;
  }

  const blocks = topBlocks(view.state.doc);
  const index = movedIndex(view.state, blocks);
  const landing = index < 0 ? "one-step" : landingFor(direction, blocks, index);

  if (typeof landing === "number") {
    view.dispatch(moveBefore(view.state, blocks[index], landing));
  }

  return landing !== "one-step";
}

/** Mod as BlockNote's own Shift-Mod-Arrow reads it: Cmd on Apple platforms, Ctrl elsewhere. */
function moveDirection(event: KeyboardEvent): Direction | undefined {
  return isMod(event) && event.shiftKey && !event.altKey
    ? MOVE_KEYS[event.key]
    : undefined;
}

function isMod({ metaKey, ctrlKey }: KeyboardEvent): boolean {
  return IS_APPLE ? metaKey && !ctrlKey : ctrlKey && !metaKey;
}

/** The top-level block the cursor or a selected block sits in. A nested block, a table's cells or a run of blocks moves one step, as BlockNote moves it. */
function movedIndex(state: EditorState, blocks: readonly TopBlock[]): number {
  const { selection } = state;

  if (!isTopLevel(selection)) {
    return -1;
  }

  return blocks.findIndex(
    ({ pos, node, type }) =>
      pos < selection.from &&
      selection.to < pos + node.nodeSize &&
      !STRUCTURAL.includes(type),
  );
}

export function isTopLevel(selection: Selection): boolean {
  const { $from, $to } = selection;
  const deepest = deepestFor(selection);

  return $from.depth <= deepest && $to.depth <= deepest;
}

/** How deep a selection of this kind may start and still sit in a top-level block; any other kind of selection never does. */
function deepestFor(selection: Selection): number {
  if (selection instanceof NodeSelection) {
    return NODE_DEPTH;
  }

  return selection instanceof TextSelection ? TEXT_DEPTH : -1;
}

function landingFor(
  direction: Direction,
  blocks: readonly TopBlock[],
  index: number,
): Landing {
  return direction === "down" ? downOver(blocks, index) : upOver(blocks, index);
}

/** The last block above a section's actions goes to the top of the next section's writing. */
function downOver(blocks: readonly TopBlock[], index: number): Landing {
  if (blocks[index + 1]?.type !== SECTION_ACTIONS) {
    return "one-step";
  }

  const heading = blocks.findIndex(
    (block, at) => at > index && block.type === SECTION_HEADING,
  );
  const start = blocks.find(
    (block, at) =>
      heading >= 0 && at > heading && !MARGIN_NOTES.includes(block.type),
  );

  return start?.pos ?? "nowhere";
}

/** The first block of a section's writing, under its heading and margin notes, goes to the end of the previous section's writing: above its actions, or last in a section that has none. */
function upOver(blocks: readonly TopBlock[], index: number): Landing {
  const above = blocks.slice(0, index).reverse();
  const heading = above.find((block) => !MARGIN_NOTES.includes(block.type));

  if (!heading || heading.type !== SECTION_HEADING) {
    return "one-step";
  }

  const previous = above.find(
    (block) =>
      block.pos < heading.pos &&
      [SECTION_ACTIONS, SECTION_HEADING].includes(block.type),
  );

  return previous?.type === SECTION_ACTIONS
    ? previous.pos
    : previousEnd(previous, heading);
}

/** A previous section without actions ends where this section's heading starts; the first section has nothing above it. */
function previousEnd(
  previous: TopBlock | undefined,
  heading: TopBlock,
): Landing {
  return previous ? heading.pos : "nowhere";
}

/** Takes the block out and puts it back before the landing, keeping the cursor where it was inside the block. */
function moveBefore(
  state: EditorState,
  moved: TopBlock | undefined,
  landing: number,
): Transaction {
  const { tr: transaction, selection } = state;

  if (!moved) {
    return transaction;
  }

  const { pos, node } = moved;
  transaction.delete(pos, pos + node.nodeSize);
  const at = transaction.mapping.map(landing);
  transaction.insert(at, node);

  return transaction
    .setSelection(shifted(transaction.doc, selection, at - pos))
    .scrollIntoView();
}

/** The selection the block carried, wherever the block went. */
function shifted(doc: Node, selection: Selection, shift: number): Selection {
  return selection instanceof NodeSelection
    ? NodeSelection.create(doc, selection.from + shift)
    : TextSelection.create(
        doc,
        selection.anchor + shift,
        selection.head + shift,
      );
}
