import type { SectionSlot } from "@re-cinq/planning-document";

import {
  MENU_ENTRIES,
  type InsertContext,
  type MenuEntry,
} from "./menu-entries.js";

export interface ResolvedEntry {
  title: string;
  group: string;
  aliases: readonly string[];
  block: { type: string; props: Record<string, unknown>; content?: unknown };
}

export function menuEntries(
  slot: SectionSlot,
  context: InsertContext,
): ResolvedEntry[] {
  return MENU_ENTRIES.filter((entry) =>
    slot.allows.includes(entry.kind),
  ).flatMap((entry) => resolve(entry, context));
}

function resolve(entry: MenuEntry, context: InsertContext): ResolvedEntry[] {
  const props = entry.props ? entry.props(context) : {};

  if (props === null) {
    return [];
  }

  const content = entry.content === undefined ? {} : { content: entry.content };

  return [
    {
      title: entry.title,
      group: entry.group,
      aliases: entry.aliases ?? [],
      block: { type: entry.kind, props, ...content },
    },
  ];
}
