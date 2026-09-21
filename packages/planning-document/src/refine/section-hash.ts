import type { BlockJson } from "../blocks/block-json.js";
import { shortHash } from "../lib/short-hash.js";
import { partitionSections } from "../projection/partition.js";
import { NOT_CONTENT } from "../template/slots.js";

/** The conversation about a section: a refine reads it, and never rewrites it. */
export const CONVERSATION: readonly string[] = [
  ...NOT_CONTENT,
  "question",
  "answer",
];

export class SectionChangedError extends Error {}

/** What a refine would rewrite in a section, as a hash: its written blocks, not the talk about them. */
export function sectionHash(
  blocks: readonly BlockJson[],
  slot: string,
): string {
  return shortHash(JSON.stringify(writtenIn(blocks, slot)));
}

export function writtenIn(
  blocks: readonly BlockJson[],
  slot: string,
): BlockJson[] {
  const section = partitionSections(blocks).find(
    (candidate) => candidate.slot === slot,
  );

  return (section?.blocks ?? []).filter(
    (block) => !CONVERSATION.includes(block.type),
  );
}
