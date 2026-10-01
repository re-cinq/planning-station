import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { BlockJson, PlanDocument, PlanMeta } from '@re-cinq/planning-document';
import { PlanSchema } from './plan-schema.js';
export type PlanPartialBlock = PartialBlock<PlanSchema["blockSchema"], PlanSchema["inlineContentSchema"], PlanSchema["styleSchema"]>;
export type PlanBlockNoteEditor = BlockNoteEditor<PlanSchema["blockSchema"], PlanSchema["inlineContentSchema"], PlanSchema["styleSchema"]>;
export declare function asEditorBlock(block: {
    type: string;
    props: Record<string, unknown>;
}): PlanPartialBlock;
export declare function toEditorBlocks(blocks: readonly BlockJson[]): PlanPartialBlock[] | undefined;
export declare function fromEditorBlocks(blocks: readonly unknown[]): BlockJson[];
export declare function projectBlocks(blocks: readonly unknown[], meta: PlanMeta): PlanDocument;
