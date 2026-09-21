import { z } from "zod";

import type { PlanBlockKind } from "./plan-block-configs.js";
import {
  planBlockSchema,
  isPlanBlockKind,
  type PlanBlock,
} from "./plan-blocks.js";
import { proseBlockSchema, type ProseBlock } from "./prose-blocks.js";

export type BlockJson = PlanBlock | ProseBlock;

export type PlanBlockOf<K extends PlanBlockKind> = Extract<
  PlanBlock,
  { type: K }
>;

export function blocksOfType<K extends PlanBlockKind>(
  blocks: readonly BlockJson[],
  type: K,
): PlanBlockOf<K>[] {
  return blocks.filter((block): block is PlanBlockOf<K> => block.type === type);
}

export const blockJsonSchema: z.ZodType<BlockJson> = z.custom<BlockJson>(
  (value) => schemaFor(value).safeParse(value).success,
  { message: "not a plan block or an allowed prose block" },
);

export function parseBlock(value: unknown): BlockJson {
  return schemaFor(value).parse(value);
}

export function isPlanBlock(block: BlockJson): block is PlanBlock {
  return isPlanBlockKind(block.type);
}

function schemaFor(value: unknown): z.ZodType<BlockJson> {
  const type = (value as { type?: unknown } | null)?.type;

  return typeof type === "string" && isPlanBlockKind(type)
    ? planBlockSchema
    : proseBlockSchema;
}
