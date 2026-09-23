import type { AgentOp } from "../ops/agent-ops.js";
import type { ProseInput } from "../ops/prose-input.js";
import { allowsBlock, disallowedBlockMessage } from "../template/slots.js";
import type { SectionSlot } from "../template/template.js";
import type { MarkdownOps, MarkdownProblem } from "./markdown-outcome.js";

/** A pass never writes what validation would flag: a block its section has no place for is refused and reported. Only what the pass adds is judged, so a block a person already wrote stays. */
export function withoutDisallowed(
  outcome: MarkdownOps,
  slot: SectionSlot,
): MarkdownOps {
  const judged = outcome.ops.map((op) => judgeOp(op, slot));

  return {
    ops: judged.flatMap(({ op }) => (op ? [op] : [])),
    problems: [
      ...outcome.problems,
      ...judged.flatMap(({ problems }) => problems),
    ],
  };
}

interface JudgedOp {
  /** The op as it may be written, or null when nothing of it may. */
  op: AgentOp | null;
  problems: MarkdownProblem[];
}

function judgeOp(op: AgentOp, slot: SectionSlot): JudgedOp {
  if (op.op === "replace-block") {
    const refused = refusedIn(slot, [op.block]);

    return { op: refused.length > 0 ? null : op, problems: refused };
  }

  return op.op === "insert-blocks" || op.op === "set-section-prose"
    ? judgeBlocks(op, slot)
    : { op, problems: [] };
}

type BlocksOp = Extract<AgentOp, { op: "insert-blocks" | "set-section-prose" }>;

function judgeBlocks(op: BlocksOp, slot: SectionSlot): JudgedOp {
  const blocks = op.blocks.filter((block) => allowsBlock(slot, block.type));
  const kept = blocks.length > 0 ? { ...op, blocks } : null;

  return { op: kept, problems: refusedIn(slot, op.blocks) };
}

function refusedIn(
  slot: SectionSlot,
  blocks: readonly ProseInput[],
): MarkdownProblem[] {
  return blocks
    .filter((block) => !allowsBlock(slot, block.type))
    .map((block) => ({
      code: "disallowed-block",
      slot: slot.slot,
      message: disallowedBlockMessage(slot, block.type),
    }));
}
