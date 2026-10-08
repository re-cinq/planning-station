import type { BlockJson } from "../blocks/block-json.js";
import {
  droppedSlotsOf,
  partitionSections,
  planTitle,
} from "../projection/partition.js";
import { toBlocks } from "../projection/to-blocks.js";
import type { AgentOp } from "./agent-ops.js";

/** The section goes whole, and the plan remembers its slot so nothing asks for it again. */
export function removeSection(
  blocks: BlockJson[],
  op: Extract<AgentOp, { op: "remove-section" }>,
): BlockJson[] {
  const sections = partitionSections(blocks);

  return sections.some((section) => section.slot === op.slot)
    ? toBlocks({
        sections: sections.filter((section) => section.slot !== op.slot),
        title: planTitle(blocks) ?? "",
        droppedSlots: [...droppedSlotsOf(blocks), op.slot],
      })
    : blocks;
}
