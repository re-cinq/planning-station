import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  parseBlock,
  toPlanDocument,
  type BlockJson,
  type PlanDocument,
  type PlanMeta,
} from "@re-cinq/planning-document";

import type { PlanSchema } from "./plan-schema.js";

export type PlanPartialBlock = PartialBlock<
  PlanSchema["blockSchema"],
  PlanSchema["inlineContentSchema"],
  PlanSchema["styleSchema"]
>;

export type PlanBlockNoteEditor = BlockNoteEditor<
  PlanSchema["blockSchema"],
  PlanSchema["inlineContentSchema"],
  PlanSchema["styleSchema"]
>;

export function asEditorBlock(block: {
  type: string;
  props: Record<string, unknown>;
}): PlanPartialBlock {
  return block as PlanPartialBlock;
}

// BlockJson is the contract's structural subset of a BlockNote block; the schemas are kept in step by plan-schema.test.
export function toEditorBlocks(
  blocks: readonly BlockJson[],
): PlanPartialBlock[] | undefined {
  return blocks.length > 0
    ? (blocks as unknown as PlanPartialBlock[])
    : undefined;
}

export function fromEditorBlocks(blocks: readonly unknown[]): BlockJson[] {
  return blocks.map(parseBlock);
}

export function projectBlocks(
  blocks: readonly unknown[],
  meta: PlanMeta,
): PlanDocument {
  return toPlanDocument(fromEditorBlocks(blocks), meta);
}
