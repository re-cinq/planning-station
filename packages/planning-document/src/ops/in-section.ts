import type { BlockJson } from "../blocks/block-json.js";
import type { Section } from "../plan/plan-document.js";
import {
  partitionSections,
  planTitle,
  sectionOrder,
} from "../projection/partition.js";
import { toBlocks } from "../projection/to-blocks.js";

/** What a change makes of one section's blocks. */
export type Change = (section: Section) => BlockJson[];

/** Rewrites one section's blocks, leaving every other section as it is. */
export function inSection(
  blocks: readonly BlockJson[],
  slot: string,
  change: Change,
): BlockJson[] {
  const sections = partitionSections(blocks).map((section) =>
    section.slot === slot
      ? { ...section, blocks: sectionOrder(change(section)) }
      : section,
  );

  return withSections(blocks, sections);
}

/** The blocks a plan's sections make, keeping the plan's own title. */
export function withSections(
  blocks: readonly BlockJson[],
  sections: readonly Section[],
): BlockJson[] {
  return toBlocks({ sections: [...sections], title: planTitle(blocks) ?? "" });
}
