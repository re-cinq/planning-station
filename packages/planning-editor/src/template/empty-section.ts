import { createExtension, type ExtensionOptions } from "@blocknote/core";
import type { Node } from "prosemirror-model";
import {
  NodeSelection,
  Plugin,
  PluginKey,
  type EditorState,
  type Selection,
} from "prosemirror-state";
import { DecorationSet, type EditorView } from "prosemirror-view";

import { holdsPaste, leave } from "./focus-release.js";

export { EMPTY_SECTION_TEXT } from "./placeholders.js";
import { placeholders, writeBefore } from "./placeholders.js";
import { STRUCTURAL } from "./template-guard.js";
import { writes } from "./writing-keys.js";
import { topBlocks, type TopBlock } from "./top-blocks.js";

const PLACEHOLDER = new PluginKey("planEmptySection");

/** The skeleton a click must not select; the title is text people type in, so a click there is the editor's own. */
const SECTION_SKELETON = STRUCTURAL.filter((type) => type !== "plan-title");

/** The wrappers BlockNote draws around blocks: a press on one of them, or on the editor's padding, is beside every block rather than on one. */
const BESIDE_BLOCKS = ".bn-block-group, .bn-block-outer, .bn-block";

/** What inside a section's skeleton takes a press of its own. */
const INTERACTIVE = "button, input, textarea, select, a, [role='button']";

/** A control that takes nothing: a press on it is a press on the skeleton around it. */
const DISABLED = ":disabled, [aria-disabled='true']";

/** The skeleton blocks whose text can be selected to copy it: what the agent proposes, why it failed, what removing asks. A heading's title and hint cannot be selected, so a press on them would only focus the editor. */
const SELECTABLE_TEXT_IN: readonly string[] = [
  "section-panel",
  "section-actions",
];

const MIDDLE_BUTTON = 1;

type Editor = ExtensionOptions["editor"];

/** Where the browser keeps the selection: a shadow root has its own in Chromium, a document always does. */
type Root =
  Document | (ShadowRoot & { getSelection?: () => DomSelection | null });
type DomSelection = globalThis.Selection;

/** Gives a section nobody has written in a place to click, and keeps the editor's padding and skeleton from taking the cursor. */
export const emptySectionPlaceholder = createExtension(
  ({ editor }: ExtensionOptions) => ({
    key: "planEmptySection",
    prosemirrorPlugins: [
      new Plugin({ key: PLACEHOLDER, props: propsFor(editor) }),
    ],
  }),
)();

function propsFor(editor: Editor) {
  const write = (beforeId: string) => writeBefore(editor, beforeId);

  return {
    decorations: (state: EditorState) =>
      editor.isEditable
        ? DecorationSet.create(state.doc, placeholders(state.doc, write))
        : DecorationSet.empty,
    handleDOMEvents: { mousedown: ignoresPress },
    handleClickOn: isSkeleton,
    handleKeyDown: ignoresKeysOnSkeleton,
    handlePaste: ignoresPasteOnSkeleton,
  };
}

/** A read-only plan is read and copied from, so it keeps every press. Every button is weighed: a right or middle press moves the caret too, and ignoring it still opens the context menu. A middle press the editor ignores, or one on a section's skeleton text, pastes on release where the caret was, so that paste is held. */
function ignoresPress(view: EditorView, event: MouseEvent): boolean {
  const ignored = view.editable && ignoresOn(view, event);

  if (ignored) {
    leave(view);
  }

  const skeleton = ignored || isOnSkeleton(view, event.target);

  if (skeleton && isMiddle(view, event)) {
    holdsPaste(view);
  }

  return ignored;
}

function isMiddle(view: EditorView, event: MouseEvent): boolean {
  return view.editable && event.button === MIDDLE_BUTTON;
}

function ignoresOn(view: EditorView, event: MouseEvent): boolean {
  return ignoresBesideBlocks(view, event) || ignoresSkeletonSpace(view, event);
}

/** A paste after selecting text in a section's panel or actions has nowhere it belongs either: ProseMirror would put it where the caret was. A paste into the panel's own input is the input's. */
export function ignoresPasteOnSkeleton(
  view: EditorView,
  event: ClipboardEvent,
): boolean {
  return view.editable && !isInteractive(event.target) && onSkeleton(view);
}

/** Text in a section's panel or actions can be selected to copy it, which leaves the editor focused with its caret where it was, or selects the block itself. A key that writes or deletes then has nowhere it belongs, so it does nothing, rather than act on that caret or put a paragraph beside the block. Keys typed into the panel's own input are the input's. */
export function ignoresKeysOnSkeleton(
  view: EditorView,
  event: KeyboardEvent,
): boolean {
  return writes(event) && !isInteractive(event.target) && onSkeleton(view);
}

function onSkeleton(view: EditorView): boolean {
  return selectsSkeleton(view.state.selection) || readsSkeleton(view);
}

/** Where the browser's own selection sits: in a section's skeleton after a press on its text, whatever ProseMirror's selection says. */
function readsSkeleton(view: EditorView): boolean {
  const anchor = anchorOf(view);
  const element = anchor instanceof Element ? anchor : anchor?.parentElement;

  return element && view.dom.contains(element)
    ? SECTION_SKELETON.includes(contentTypeOf(element))
    : false;
}

function anchorOf({ root, dom }: EditorView) {
  const rooted: Root = root;
  const selection = rooted.getSelection?.() ?? dom.ownerDocument.getSelection();

  return selection?.anchorNode;
}

function isInteractive(target: EventTarget | null): boolean {
  const control =
    target instanceof Element ? target.closest(INTERACTIVE) : null;

  return control !== null && !control.matches(DISABLED);
}

function selectsSkeleton(selection: Selection): boolean {
  if (!(selection instanceof NodeSelection)) {
    return false;
  }

  const { type } = selection.node;

  return SECTION_SKELETON.includes(type.name);
}

/** A press beside the blocks, level only with a section's skeleton, neither focuses the editor nor selects a block; level with a line of text, or in a gap, it still puts the caret where the editor would. */
export function ignoresBesideBlocks(
  view: EditorView,
  event: MouseEvent,
): boolean {
  if (!isBesideBlocks(view, event.target) || !onlySkeletonLevel(view, event)) {
    return false;
  }

  event.preventDefault();

  return true;
}

/** A press on a section's heading, panel or actions, away from their buttons, inputs and selectable text, takes nothing either: the editor has no place to put the caret there. A press on selectable text still starts a selection, so it can be copied. */
export function ignoresSkeletonSpace(
  view: EditorView,
  event: MouseEvent,
): boolean {
  if (!isSkeletonSpace(view, event.target)) {
    return false;
  }

  event.preventDefault();

  return true;
}

function isSkeletonSpace(view: EditorView, target: EventTarget | null) {
  if (!(target instanceof Element) || !view.dom.contains(target)) {
    return false;
  }

  const type = contentTypeOf(target);

  return (
    SECTION_SKELETON.includes(type) &&
    !isInteractive(target) &&
    !(SELECTABLE_TEXT_IN.includes(type) && holdsText(target))
  );
}

/** A press anywhere on a section's skeleton, text and controls included: a middle one there pastes, on release, where the caret was. */
function isOnSkeleton(view: EditorView, target: EventTarget | null) {
  return (
    target instanceof Element &&
    view.dom.contains(target) &&
    SECTION_SKELETON.includes(contentTypeOf(target))
  );
}

function holdsText(target: Element): boolean {
  return [...target.childNodes].some(
    (child) => child instanceof Text && child.data.trim() !== "",
  );
}

function contentTypeOf(target: Element): string {
  const content = target.closest(".bn-block-content");

  return content?.getAttribute("data-content-type") ?? "";
}

function isBesideBlocks(view: EditorView, target: EventTarget | null) {
  return (
    target instanceof Element &&
    (target === view.dom || target.matches(BESIDE_BLOCKS))
  );
}

/** Reads the rows the blocks are drawn on, not ProseMirror's nearest position: a margin note floats beside the writing, so the nearest position can be anywhere on the page. */
function onlySkeletonLevel(view: EditorView, event: MouseEvent): boolean {
  const level = topBlocks(view.state.doc).filter((block) =>
    isLevelWith(view, block, event.clientY),
  );

  return (
    level.length > 0 &&
    level.every((block) => SECTION_SKELETON.includes(block.type))
  );
}

function isLevelWith(view: EditorView, { pos }: TopBlock, row: number) {
  const drawn = view.nodeDOM(pos);

  if (!(drawn instanceof Element)) {
    return false;
  }

  const { top, bottom } = drawn.getBoundingClientRect();

  return top <= row && row <= bottom;
}

/** A click on a section's skeleton is handled, so ProseMirror never selects the block itself; its buttons still take the click. */
function isSkeleton(...[view, , node]: [EditorView, number, Node]): boolean {
  return view.editable && SECTION_SKELETON.includes(node.type.name);
}
