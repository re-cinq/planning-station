import type { ExtensionOptions } from "@blocknote/core";
import {
  MARGIN_NOTES,
  NOT_CONTENT,
  SECTION_ACTIONS,
} from "@re-cinq/planning-document";
import type { Node } from "prosemirror-model";
import { Decoration } from "prosemirror-view";

import { SECTION_HEADING, topBlocks, type TopBlock } from "./top-blocks.js";

export const EMPTY_SECTION_TEXT = "Write here…";

const PARAGRAPH = "paragraph";
const PLACEHOLDER_CLASS = "ps-empty-section";

/** What a section carries besides its writing: its margin notes and actions, and the agent's questions with their answers. */
const NOT_WRITING: readonly string[] = [...NOT_CONTENT, "question", "answer"];

const MAIN_BUTTON = 0;

type Editor = ExtensionOptions["editor"];

interface Section {
  title: string;
  blocks: TopBlock[];
  /** Whether its actions have been reached. */
  closed: boolean;
}

type Write = (beforeId: string) => void;

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

/** Blank as planning-document's `isBlankParagraph` reads it: no children, and nothing inline, not even a line break. */
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
    pressPlaceholder(event, write);
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      write();
    }
  });

  return element;
}

/** Only the main button writes; another button's press takes no focus either, and a right one still opens the context menu. */
function pressPlaceholder(event: MouseEvent, write: () => void): void {
  event.preventDefault();

  if (event.button === MAIN_BUTTON) {
    write();
  }
}

/** Puts a paragraph where the section's writing starts and the cursor in it. */
export function writeBefore(editor: Editor, beforeId: string): void {
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
