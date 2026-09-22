import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { AgentOp } from "../ops/agent-ops.js";
import { toProseBlocks, type ProseInput } from "../ops/prose-input.js";
import { diffLines, type LineChange } from "../lib/diff-lines.js";
import { writeProse } from "./write-prose.js";

/** What the walk has decided so far: the ops, the run of added blocks not yet placed, and the live block they follow. */
interface Walk {
  slot: string;
  live: readonly ProseBlock[];
  written: readonly ProseInput[];
  liveAt: number;
  writtenAt: number;
  after: string | null;
  pending: ProseInput[];
  ops: AgentOp[];
}

/** The ops that turn a section's live prose into what the file says, block by block: a block the file rewrote is replaced by its id, so it keeps the id a person's cursor sits in, and only what the file added or dropped moves. */
export function proseDiffOps(
  slot: string,
  live: readonly ProseBlock[],
  written: readonly ProseInput[],
): AgentOp[] {
  const walk = walking(slot, live, written);
  paired(
    diffLines(canonical(live), canonical(toProseBlocks(slot, written))),
  ).forEach((kind) => step(walk, kind));
  flush(walk);

  return walk.ops;
}

function walking(
  slot: string,
  live: readonly ProseBlock[],
  written: readonly ProseInput[],
): Walk {
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
function paired(changes: readonly LineChange[]): Step[] {
  const steps: Step[] = [];
  let skip = false;

  changes.forEach((change, index) => {
    const rewrite =
      change.kind === "removed" && changes[index + 1]?.kind === "added";

    if (skip) {
      skip = false;

      return;
    }

    skip = rewrite;
    steps.push(rewrite ? "rewritten" : change.kind);
  });

  return steps;
}

type Step = LineChange["kind"] | "rewritten";

function step(walk: Walk, kind: Step): void {
  const STEPS = { kept: keep, added: add, removed: remove, rewritten: rewrite };
  STEPS[kind](walk);
}

function keep(walk: Walk): void {
  flush(walk);
  walk.after = idAt(walk);
  walk.liveAt += 1;
  walk.writtenAt += 1;
}

/** A block the file wrote another in place of: replaced by its id, so it keeps the id a person's cursor sits in. */
function rewrite(walk: Walk): void {
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
function remove(walk: Walk): void {
  flush(walk);
  walk.ops.push({
    op: "remove-block",
    slot: walk.slot,
    blockId: idAt(walk),
  });
  walk.liveAt += 1;
}

function add(walk: Walk): void {
  const block = walk.written[walk.writtenAt];
  walk.writtenAt += 1;

  if (block) {
    walk.pending.push(block);
  }
}

/** The run of added blocks goes in as one insert, after the block it follows. */
function flush(walk: Walk): void {
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

function idAt({ live, liveAt }: Walk): string {
  const block = live[liveAt];

  return block ? block.id : "";
}

function canonical(blocks: readonly ProseBlock[]): string[] {
  return blocks.map((block) => writeProse([block]).join("\n"));
}
