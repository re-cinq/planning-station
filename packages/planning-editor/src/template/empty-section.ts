import { createExtension, type ExtensionOptions } from "@blocknote/core";
import {
  MARGIN_NOTES,
  NOT_CONTENT,
  SECTION_ACTIONS,
} from "@re-cinq/planning-document";
import type { Node } from "prosemirror-model";
import {
  NodeSelection,
  Plugin,
  PluginKey,
  type EditorState,
  type Selection,
} from "prosemirror-state";
import { Decoration, DecorationSet, type EditorView } from "prosemirror-view";

import { STRUCTURAL } from "./template-guard.js";
import { SECTION_HEADING, topBlocks, type TopBlock } from "./top-blocks.js";

export const EMPTY_SECTION_TEXT = "Write here…";

const PLACEHOLDER = new PluginKey("planEmptySection");
const PARAGRAPH = "paragraph";
const PLACEHOLDER_CLASS = "ps-empty-section";

/** What a section carries besides its writing: its margin notes and actions, and the agent's questions with their answers. */
const NOT_WRITING: readonly string[] = [...NOT_CONTENT, "question", "answer"];

/** The skeleton a click must not select; the title is text people type in, so a click there is the editor's own. */
const SECTION_SKELETON = STRUCTURAL.filter((type) => type !== "plan-title");

/** The wrappers BlockNote draws around blocks: a press on one of them, or on the editor's padding, is beside every block rather than on one. */
const BESIDE_BLOCKS = ".bn-block-group, .bn-block-outer, .bn-block";

/** What inside a section's skeleton takes a press of its own. */
const INTERACTIVE = "button, input, textarea, select, a, [role='button']";

/** The skeleton blocks whose text can be selected to copy it: what the agent proposes, why it failed, what removing asks. A heading's title and hint cannot be selected, so a press on them would only focus the editor. */
const SELECTABLE_TEXT_IN: readonly string[] = [
  "section-panel",
  "section-actions",
];

/** Keys that write or delete, besides a typed character. */
const EDITING_KEYS: readonly string[] = ["Enter", "Backspace", "Delete"];

type Editor = ExtensionOptions["editor"];

/** Where the browser keeps the selection: a shadow root has its own in Chromium, a document always does. */
type Root =
  Document | (ShadowRoot & { getSelection?: () => DomSelection | null });
type DomSelection = globalThis.Selection;

interface Section {
  title: string;
  blocks: TopBlock[];
  /** Whether its actions have been reached. */
  closed: boolean;
}

type Write = (beforeId: string) => void;

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
  };
}

/** A read-only plan is read and copied from, so it keeps every press. Every button is weighed: a right or middle press moves the caret too, and ignoring it still opens the context menu. */
function ignoresPress(view: EditorView, event: MouseEvent): boolean {
  const ignored =
    view.editable &&
    (ignoresBesideBlocks(view, event) || ignoresSkeletonSpace(view, event));

  if (ignored) {
    leave(view);
  }

  return ignored;
}

/** A press the editor ignores still moves the person's attention away from where the caret was, so the editor lets go of focus: the next key must not write there. */
function leave(view: EditorView): void {
  const { dom } = view;

  if (dom instanceof HTMLElement) {
    dom.blur();
  }
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
  return target instanceof Element && target.closest(INTERACTIVE) !== null;
}

function selectsSkeleton(selection: Selection): boolean {
  if (!(selection instanceof NodeSelection)) {
    return false;
  }

  const { type } = selection.node;

  return SECTION_SKELETON.includes(type.name);
}

function writes({ key, metaKey, ctrlKey }: KeyboardEvent): boolean {
  const typed = EDITING_KEYS.includes(key) || key.length === 1;

  return typed && !metaKey && !ctrlKey;
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

export function placeholders(doc: Node, write: Write): Decoration[] {
  return sectionsOf(topBlocks(doc)).flatMap((section) =>
    placeholderOf(section, write),
  );
}

/** Each section's blocks down to its actions. A block under them is out of place, never where a placeholder belongs. */
function sectionsOf(blocks: readonly TopBlock[]): Section[] {
  return blocks.reduce<Section[]>((sections, block) => {
    if (block.type === SECTION_HEADING) {
      sections.push({ title: titleOf(block), blocks: [], closed: false });

      return sections;
    }

    const current = sections.at(-1);

    if (current && !current.closed) {
      current.blocks.push(block);
      current.closed = block.type === SECTION_ACTIONS;
    }

    return sections;
  }, []);
}

function titleOf({ content }: TopBlock): string {
  return String(content?.attrs["title"] ?? "");
}

/** An unwritten section's empty paragraph shows the placeholder; one without a paragraph gets it under its margin notes, where its writing would start. */
function placeholderOf(section: Section, write: Write): Decoration[] {
  if (section.blocks.some(isWriting)) {
    return [];
  }

  const blank = section.blocks.find(isBlankParagraph);

  if (blank) {
    return [onBlank(blank)];
  }

  const start = section.blocks.find(
    (block) => !MARGIN_NOTES.includes(block.type),
  );

  return start ? [widgetBefore(start, section.title, write)] : [];
}

function isWriting(block: TopBlock): boolean {
  return !NOT_WRITING.includes(block.type) && !isBlankParagraph(block);
}

function isBlankParagraph({ node, content, type }: TopBlock): boolean {
  return (
    type === PARAGRAPH && node.childCount === 1 && content?.content.size === 0
  );
}

function onBlank({ pos, content }: TopBlock): Decoration {
  const from = pos + 1;

  return Decoration.node(from, from + (content?.nodeSize ?? 0), {
    "data-plan-placeholder": EMPTY_SECTION_TEXT,
  });
}

function widgetBefore({ pos, node }: TopBlock, title: string, write: Write) {
  const beforeId = String(node.attrs["id"] ?? "");

  return Decoration.widget(
    pos,
    () => placeholderElement(title, () => write(beforeId)),
    { side: -1, key: `empty-${beforeId}-${title}`, stopEvent: () => true },
  );
}

function placeholderElement(title: string, write: () => void): HTMLElement {
  const element = document.createElement("div");
  element.className = PLACEHOLDER_CLASS;
  element.contentEditable = "false";
  element.role = "button";
  element.tabIndex = 0;
  element.ariaLabel = `${EMPTY_SECTION_TEXT} in ${title}`;
  element.textContent = EMPTY_SECTION_TEXT;
  element.addEventListener("mousedown", (event) => {
    event.preventDefault();
    write();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      write();
    }
  });

  return element;
}

/** Puts a paragraph where the section's writing starts and the cursor in it. */
function writeBefore(editor: Editor, beforeId: string): void {
  editor.transact(() => {
    const [paragraph] = editor.insertBlocks(
      [{ type: PARAGRAPH }],
      beforeId,
      "before",
    );

    if (paragraph) {
      editor.setTextCursorPosition(paragraph, "start");
    }
  });
  editor.focus();
}
