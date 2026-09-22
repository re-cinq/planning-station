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
import {
  findSectionSlot,
  type PlanTemplate,
  type SectionSlot,
} from "@re-cinq/planning-document";

import {
  asEditorBlock,
  type PlanBlockNoteEditor,
} from "../schema/block-bridge.js";
import { planSchema } from "../schema/plan-schema.js";
import { TemplateContext } from "../template/template-context.js";
import type { InsertContext } from "./menu-entries.js";
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
  const context = { blocks, cursorId: cursor.id };
  const slot = template && slotOfCursor(template, context);

  if (!slot) {
    return [];
  }

  return menuEntries(slot, context).map(({ block, ...entry }) => ({
    ...entry,
    aliases: [...entry.aliases],
    onItemClick: () =>
      insertOrUpdateBlockForSlashMenu(editor, asEditorBlock(block)),
  }));
}

/** The template's section, or one the agent added, that the cursor is in. */
function slotOfCursor(
  template: PlanTemplate,
  { blocks, cursorId }: InsertContext,
): SectionSlot | undefined {
  const slotName = slotAt(blocks, cursorId);

  return slotName === null ? undefined : findSectionSlot(template, slotName);
}
