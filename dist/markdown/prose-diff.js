import { toProseBlocks } from "../ops/prose-input.js";
import { diffLines } from "../lib/diff-lines.js";
import { writeProse } from "./write-prose.js";
/** The ops that turn a section's live prose into what the file says, block by block: a block the file rewrote is replaced by its id, so it keeps the id a person's cursor sits in, and only what the file added or dropped moves. */
export function proseDiffOps(slot, live, written) {
    const walk = walking(slot, live, written);
    paired(diffLines(canonical(live), canonical(toProseBlocks(slot, written)))).forEach((kind) => step(walk, kind));
    flush(walk);
    return walk.ops;
}
function walking(slot, live, written) {
    return {
        slot,
        live,
        written,
        liveAt: 0,
        writtenAt: 0,
        after: null,
        pending: [],
        ops: [],
    };
}
/** A block the file dropped and wrote another in place of is ONE step, a rewrite: read as two, the addition would be written twice. */
function paired(changes) {
    const steps = [];
    let skip = false;
    changes.forEach((change, index) => {
        const rewrite = change.kind === "removed" && changes[index + 1]?.kind === "added";
        if (skip) {
            skip = false;
            return;
        }
        skip = rewrite;
        steps.push(rewrite ? "rewritten" : change.kind);
    });
    return steps;
}
function step(walk, kind) {
    const STEPS = { kept: keep, added: add, removed: remove, rewritten: rewrite };
    STEPS[kind](walk);
}
function keep(walk) {
    flush(walk);
    walk.after = idAt(walk);
    walk.liveAt += 1;
    walk.writtenAt += 1;
}
/** A block the file wrote another in place of: replaced by its id, so it keeps the id a person's cursor sits in. */
function rewrite(walk) {
    flush(walk);
    const blockId = idAt(walk);
    const block = walk.written[walk.writtenAt];
    if (!block) {
        remove(walk);
        return;
    }
    walk.ops.push({ op: "replace-block", slot: walk.slot, blockId, block });
    walk.after = blockId;
    walk.liveAt += 1;
    walk.writtenAt += 1;
}
/** A block the file dropped and wrote nothing in place of. */
function remove(walk) {
    flush(walk);
    walk.ops.push({
        op: "remove-block",
        slot: walk.slot,
        blockId: idAt(walk),
    });
    walk.liveAt += 1;
}
function add(walk) {
    const block = walk.written[walk.writtenAt];
    walk.writtenAt += 1;
    if (block) {
        walk.pending.push(block);
    }
}
/** The run of added blocks goes in as one insert, after the block it follows. */
function flush(walk) {
    if (walk.pending.length === 0) {
        return;
    }
    walk.ops.push({
        op: "insert-blocks",
        slot: walk.slot,
        after: walk.after,
        blocks: walk.pending,
    });
    walk.pending = [];
}
function idAt({ live, liveAt }) {
    const block = live[liveAt];
    return block ? block.id : "";
}
function canonical(blocks) {
    return blocks.map((block) => writeProse([block]).join("\n"));
}
//# sourceMappingURL=prose-diff.js.map