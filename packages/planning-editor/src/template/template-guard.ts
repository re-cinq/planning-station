import { createExtension } from "@blocknote/core";
import { MARGIN_NOTES, SECTION_ACTIONS } from "@re-cinq/planning-document";
import type { Node } from "prosemirror-model";
import { Plugin, type EditorState, type Transaction } from "prosemirror-state";
import { ySyncPluginKey } from "y-prosemirror";

const TEMPLATE_BYPASS = "planTemplateBypass";
const SECTION_HEADING = "section-heading";
const BLOCK_CONTENT_GROUP = "blockContent";

/** The plan's skeleton: its title, its section headings and each section's panel and actions. */
export const STRUCTURAL: readonly string[] = [
  "plan-title",
  SECTION_HEADING,
  "section-panel",
  SECTION_ACTIONS,
];

interface ContentNode {
  type: string;
  slot: string;
}

export const templateGuard = createExtension({
  key: "planTemplateGuard",
  prosemirrorPlugins: [new Plugin({ filterTransaction: keepsSectionHeadings })],
});

export function bypassTemplate(
  transaction: Transaction,
  reason: string,
): Transaction {
  return transaction.setMeta(TEMPLATE_BYPASS, reason);
}

export function keepsSectionHeadings(
  transaction: Transaction,
  state: EditorState,
): boolean {
  if (!transaction.docChanged || isExempt(transaction)) {
    return true;
  }

  const before = contentNodes(state.doc);
  const after = contentNodes(transaction.doc);

  return (
    sameSlots(skeletonOf(before), skeletonOf(after)) &&
    keepsLead(before, after) &&
    keepsActionsLast(before, after)
  );
}

// Remote collaborators and the first render of a synced document arrive through y-sync, already guarded at their source.
function isExempt(transaction: Transaction): boolean {
  const sync = transaction.getMeta(ySyncPluginKey) as
    { isChangeOrigin?: boolean } | undefined;

  return (
    Boolean(transaction.getMeta(TEMPLATE_BYPASS)) ||
    sync?.isChangeOrigin === true
  );
}

export function headingSlots(doc: Node): string[] {
  return slotsOf(contentNodes(doc));
}

function contentNodes(doc: Node): ContentNode[] {
  const nodes: ContentNode[] = [];
  doc.descendants((node) => {
    if (isBlockContent(node)) {
      nodes.push({ type: node.type.name, slot: String(node.attrs["slot"]) });
    }
  });

  return nodes;
}

function isBlockContent(node: Node): boolean {
  const { spec } = node.type;
  const groups = spec.group ?? "";

  return groups.split(" ").includes(BLOCK_CONTENT_GROUP);
}

function slotsOf(nodes: readonly ContentNode[]): string[] {
  return nodes
    .filter((node) => node.type === SECTION_HEADING)
    .map((node) => node.slot);
}

function skeletonOf(nodes: readonly ContentNode[]): string[] {
  return nodes
    .filter((node) => STRUCTURAL.includes(node.type))
    .map((node) => `${node.type}:${node.slot}`);
}

/** Only the title may sit above the first section heading; strays cannot. */
function keepsLead(
  before: readonly ContentNode[],
  after: readonly ContentNode[],
): boolean {
  return strays(after) === 0 || strays(before) > 0;
}

function strays(nodes: readonly ContentNode[]): number {
  const firstHeading = nodes.findIndex((node) => node.type === SECTION_HEADING);
  const lead = firstHeading < 0 ? nodes : nodes.slice(0, firstHeading);

  return lead.filter((node) => node.type !== "plan-title").length;
}

/** A section's actions close it: nothing may be written under them. A plan that already holds such a block keeps it, and may lose it, but no section gains one. */
function keepsActionsLast(
  before: readonly ContentNode[],
  after: readonly ContentNode[],
): boolean {
  const had = underActions(before);

  return [...underActions(after)].every(
    ([slot, count]) => count <= (had.get(slot) ?? 0),
  );
}

/** Margin notes float beside the section, and an answer goes under its question wherever that sits, so neither counts as written under the actions. */
const NOT_UNDER: readonly string[] = [...MARGIN_NOTES, "answer"];

/** How many blocks sit under each section's actions, by the section's slot. */
function underActions(nodes: readonly ContentNode[]): Map<string, number> {
  const counts = new Map<string, number>();
  nodes.reduce(
    (seen, node) => {
      if (node.type === SECTION_HEADING) {
        return { slot: node.slot, closed: false };
      }

      if (seen.closed && !NOT_UNDER.includes(node.type)) {
        counts.set(seen.slot, (counts.get(seen.slot) ?? 0) + 1);
      }

      return { slot: seen.slot, closed: seen.closed || isActions(node) };
    },
    { slot: "", closed: false },
  );

  return counts;
}

function isActions(node: ContentNode): boolean {
  return node.type === SECTION_ACTIONS;
}

function sameSlots(before: readonly string[], after: readonly string[]) {
  return (
    before.length === after.length &&
    before.every((slot, index) => slot === after[index])
  );
}
