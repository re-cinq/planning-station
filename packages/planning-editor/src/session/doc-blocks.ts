import type { BlockJson } from "@re-cinq/planning-document";
import { readBlocks } from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

const blocksCache = new WeakMap<Doc, BlockJson[]>();

/** Read once per change and shared by every section and every proposed change, instead of once per reader. */
export function blocksOf(doc: Doc): BlockJson[] {
  const cached = blocksCache.get(doc);

  if (cached) {
    return cached;
  }

  const blocks = readBlocks(doc);
  blocksCache.set(doc, blocks);
  doc.once("update", () => blocksCache.delete(doc));

  return blocks;
}
