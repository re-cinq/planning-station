// One block at a time (paragraph-level proposals): the id is the anchor, so an edit lands where its author meant it even when the section moved around it. A block that is gone is left alone rather than re-created: someone deleted it, and this change was written against a plan that still had it.

import type { BlockJson } from "../blocks/block-json.js";
import { newId } from "../lib/ids.js";
import { inSection } from "./in-section.js";
import { toProseBlocks, type ProseInput } from "./prose-input.js";
import type { AgentOp } from "./agent-ops.js";

type Handler<Kind extends AgentOp["op"]> = (
  blocks: readonly BlockJson[],
  op: Extract<AgentOp, { op: Kind }>,
) => BlockJson[];

export const replaceBlock: Handler<"replace-block"> = (blocks, op) =>
  inSection(blocks, op.slot, (section) =>
    section.blocks.map((block) =>
      block.id === op.blockId
        ? { ...proseBlockOf(op.slot, op.block), id: block.id }
        : block,
    ),
  );

export const insertBlocks: Handler<"insert-blocks"> = (blocks, op) =>
  inSection(blocks, op.slot, (section) =>
    section.blocks.flatMap((block, index) =>
      placedAfter(block, index, op) ? [block, ...inserted(op)] : [block],
    ),
  );

export const removeBlock: Handler<"remove-block"> = (blocks, op) =>
  inSection(blocks, op.slot, (section) =>
    section.blocks.filter((block) => block.id !== op.blockId),
  );

/** True for the block the insert follows — the named one, or the first block when it follows nothing. */
function placedAfter(
  block: BlockJson,
  index: number,
  op: { after: string | null },
): boolean {
  return op.after === null ? index === 0 : block.id === op.after;
}

function inserted(op: {
  slot: string;
  blocks: readonly ProseInput[];
}): BlockJson[] {
  return toProseBlocks(op.slot, op.blocks).map((block) => ({
    ...block,
    id: newId("p"),
  }));
}

function proseBlockOf(slot: string, input: ProseInput): BlockJson {
  return toProseBlocks(slot, [input])[0] as BlockJson;
}
