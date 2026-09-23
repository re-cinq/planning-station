import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { AgentOp } from "../ops/agent-ops.js";
import { toProseBlocks, type ProseInput } from "../ops/prose-input.js";
import { allowsBlock, disallowedBlockMessage } from "../template/slots.js";
import type { SectionSlot } from "../template/template.js";
import type { MarkdownProblem } from "./markdown-outcome.js";
import { writeProse } from "./write-prose.js";

/** Both sides of a section's prose, with what its slot has no place for taken out before they are compared. */
export interface JudgedProse {
  live: ProseBlock[];
  written: ProseInput[];
  problems: MarkdownProblem[];
}

/** A pass never writes what validation would flag, and never touches what a person already wrote. A refused block the pass repeats as it stands is the person's and is compared as unchanged, so what the pass adds beside it anchors to it; one the pass left out leaves the comparison, so it is never removed; one the pass wrote itself is dropped and reported. A section with no known slot is compared whole. */
export function judgeProse(
  slot: SectionSlot | undefined,
  live: ProseBlock[],
  written: ProseInput[],
): JudgedProse {
  if (!slot) {
    return { live, written, problems: [] };
  }

  const judge = judgeIn(slot, live);

  return {
    live: comparedLive(judge, live, written),
    written: written.filter(
      (block) => judge.allows(block) || judge.repeats(block),
    ),
    problems: written
      .filter(judge.refuses)
      .map((block) => refusal(slot, block)),
  };
}

/** The live side of the comparison: what the slot allows, and a person's refused block only where the pass repeats it. */
function comparedLive(
  judge: Judge,
  live: ProseBlock[],
  written: readonly ProseInput[],
): ProseBlock[] {
  const repeated = new Set(written.filter(judge.repeats).map(judge.keyOf));

  return live.filter(
    (block) => judge.allows(block) || repeated.has(canonical(block)),
  );
}

/** How one section judges the prose written into it, against the refused blocks people already wrote there. */
interface Judge {
  allows(block: { type: string }): boolean;
  /** A refused block that repeats one a person wrote, exactly as it stands. */
  repeats(block: ProseInput): boolean;
  /** A refused block the pass wrote itself. */
  refuses(block: ProseInput): boolean;
  keyOf(block: ProseInput): string;
}

function judgeIn(slot: SectionSlot, live: readonly ProseBlock[]): Judge {
  const allows = (block: { type: string }) => allowsBlock(slot, block.type);
  const keyOf = (block: ProseInput) => canonicalInput(slot.slot, block);
  const standing = new Set(
    live.filter((block) => !allows(block)).map(canonical),
  );
  const repeats = (block: ProseInput) =>
    !allows(block) && standing.has(keyOf(block));

  return {
    allows,
    repeats,
    refuses: (block) => !allows(block) && !repeats(block),
    keyOf,
  };
}

function refusal(slot: SectionSlot, block: ProseInput): MarkdownProblem {
  return {
    code: "disallowed-block",
    slot: slot.slot,
    message: disallowedBlockMessage(slot, block.type),
  };
}

function canonical(block: ProseBlock): string {
  return writeProse([block]).join("\n");
}

function canonicalInput(slot: string, block: ProseInput): string {
  return writeProse(toProseBlocks(slot, [block])).join("\n");
}

/** The diff's ops, held to the same rule: a copy or a move of a person's refused block pairs as a new insert, so no op may add a refused block or take away one a person wrote. */
export function guardOps(
  ops: readonly AgentOp[],
  slot: SectionSlot | undefined,
  live: readonly ProseBlock[],
): { ops: AgentOp[]; problems: MarkdownProblem[] } {
  if (!slot) {
    return { ops: [...ops], problems: [] };
  }

  const theirs = new Set(
    live.filter((block) => !allowsBlock(slot, block.type)).map(({ id }) => id),
  );
  const guarded = ops.map((op) => guardOp(op, slot, theirs));

  return {
    ops: joinedInserts(guarded.flatMap(({ op }) => (op ? [op] : []))),
    problems: guarded.flatMap(({ problems }) => problems),
  };
}

/** A rewrite turned into an insert anchors where the run after it anchors too; as two inserts after one block they would land in reverse, so they are joined in the order written. */
function joinedInserts(ops: readonly AgentOp[]): AgentOp[] {
  return ops.reduce<AgentOp[]>((joined, op) => {
    const last = joined.at(-1);
    const follows =
      last?.op === "insert-blocks" &&
      op.op === "insert-blocks" &&
      last.after === op.after;

    return follows
      ? [
          ...joined.slice(0, -1),
          { ...last, blocks: [...last.blocks, ...op.blocks] },
        ]
      : [...joined, op];
  }, []);
}

interface GuardedOp {
  op: AgentOp | null;
  problems: MarkdownProblem[];
}

function guardOp(
  op: AgentOp,
  slot: SectionSlot,
  theirs: ReadonlySet<string>,
): GuardedOp {
  if (op.op === "remove-block") {
    return { op: theirs.has(op.blockId) ? null : op, problems: [] };
  }

  if (op.op === "replace-block") {
    return theirs.has(op.blockId)
      ? guardInsert(besideTheirs(op), slot)
      : guardReplace(op, slot);
  }

  return op.op === "insert-blocks"
    ? guardInsert(op, slot)
    : { op, problems: [] };
}

type ReplaceOp = Extract<AgentOp, { op: "replace-block" }>;
type InsertOp = Extract<AgentOp, { op: "insert-blocks" }>;

/** A rewrite aimed at a person's refused block writes its block after that one instead, so the pass's words land and the person's stay. */
function besideTheirs({ slot, blockId, block }: ReplaceOp): InsertOp {
  return { op: "insert-blocks", slot, after: blockId, blocks: [block] };
}

function guardReplace(op: ReplaceOp, slot: SectionSlot): GuardedOp {
  const refused = refusedAmong(slot, [op.block]);

  return { op: refused.length > 0 ? null : op, problems: refused };
}

function guardInsert(op: InsertOp, slot: SectionSlot): GuardedOp {
  const blocks = op.blocks.filter((block) => allowsBlock(slot, block.type));

  return {
    op: blocks.length > 0 ? { ...op, blocks } : null,
    problems: refusedAmong(slot, op.blocks),
  };
}

function refusedAmong(
  slot: SectionSlot,
  blocks: readonly ProseInput[],
): MarkdownProblem[] {
  return blocks
    .filter((block) => !allowsBlock(slot, block.type))
    .map((block) => refusal(slot, block));
}
