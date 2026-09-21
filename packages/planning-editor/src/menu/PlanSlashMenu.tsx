import { useContext } from "react";
import {
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core";
import {
  SuggestionMenuController,
  useBlockNoteEditor,
  type DefaultReactSuggestionItem,
} from "@blocknote/react";
import type { PlanTemplate } from "@re-cinq/planning-document";

import {
  asEditorBlock,
  type PlanBlockNoteEditor,
} from "../schema/block-bridge.js";
import { planSchema } from "../schema/plan-schema.js";
import { TemplateContext } from "../template/template-context.js";
import { menuEntries } from "./menu-items.js";
import { slotAt, type MenuBlock } from "./section-context.js";

export function PlanSlashMenu() {
  const editor = useBlockNoteEditor(planSchema);
  const template = useContext(TemplateContext);

  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(itemsAtCursor(editor, template), query)
      }
    />
  );
}

export function itemsAtCursor(
  editor: PlanBlockNoteEditor,
  template: PlanTemplate | null,
): DefaultReactSuggestionItem[] {
  const blocks = editor.document as readonly MenuBlock[];
  const { block: cursor } = editor.getTextCursorPosition();
  const slotName = slotAt(blocks, cursor.id);
  const slot = template?.slots.find((candidate) => candidate.slot === slotName);

  if (!slot) {
    return [];
  }

  const context = { blocks, cursorId: cursor.id };

  return menuEntries(slot, context).map(({ block, ...entry }) => ({
    ...entry,
    aliases: [...entry.aliases],
    onItemClick: () =>
      insertOrUpdateBlockForSlashMenu(editor, asEditorBlock(block)),
  }));
}
