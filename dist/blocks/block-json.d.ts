import { z } from "zod";
import type { PlanBlockKind } from "./plan-block-configs.js";
import { type PlanBlock } from "./plan-blocks.js";
import { type ProseBlock } from "./prose-blocks.js";
export type BlockJson = PlanBlock | ProseBlock;
export type PlanBlockOf<K extends PlanBlockKind> = Extract<PlanBlock, {
    type: K;
}>;
export declare function blocksOfType<K extends PlanBlockKind>(blocks: readonly BlockJson[], type: K): PlanBlockOf<K>[];
export declare const blockJsonSchema: z.ZodType<BlockJson>;
export declare function parseBlock(value: unknown): BlockJson;
export declare function isPlanBlock(block: BlockJson): block is PlanBlock;
//# sourceMappingURL=block-json.d.ts.map