import { shortHash } from "../lib/short-hash.js";
/** One block as it reads now, hashed; empty for a block the plan no longer holds, or for no block at all. */
export function blockHash(blocks, blockId) {
    const block = blockId
        ? blocks.find((candidate) => candidate.id === blockId)
        : undefined;
    return block ? shortHash(JSON.stringify(block)) : "";
}
//# sourceMappingURL=block-hash.js.map