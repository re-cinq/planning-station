import type { AgentOp } from "../ops/agent-ops.js";
/** What a pass writes at once and what it proposes. */
export interface PartitionedPass {
    written: AgentOp[];
    proposed: AgentOp[];
}
/** What a pass writes at once and what it proposes. A section the pass adds is structure, and structure is the agent's alone, so it and everything the pass puts in it are written in as a draft's ops are; every other op waits as a change. */
export declare function partitionPass(ops: readonly AgentOp[]): PartitionedPass;
//# sourceMappingURL=partition-pass.d.ts.map