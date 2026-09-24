import type { AgentOp } from "../ops/agent-ops.js";
import { slotOf } from "./refine-proposal.js";

/** What a pass writes at once and what it proposes. */
export interface PartitionedPass {
  written: AgentOp[];
  proposed: AgentOp[];
}

/** What a pass writes at once and what it proposes. A section the pass adds is structure, and structure is the agent's alone, so it and everything the pass puts in it are written in as a draft's ops are; every other op waits as a change. */
export function partitionPass(ops: readonly AgentOp[]): PartitionedPass {
  const added = new Set(
    ops.flatMap((op) => (op.op === "add-section" ? [op.slot] : [])),
  );

  return {
    written: ops.filter((op) => added.has(slotOf(op))),
    proposed: ops.filter((op) => !added.has(slotOf(op))),
  };
}
