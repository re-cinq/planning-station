import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { AgentOp } from "../ops/agent-ops.js";
import { type ProseInput } from "../ops/prose-input.js";
/** The ops that turn a section's live prose into what the file says, block by block: a block the file rewrote is replaced by its id, so it keeps the id a person's cursor sits in, and only what the file added or dropped moves. */
export declare function proseDiffOps(slot: string, live: readonly ProseBlock[], written: readonly ProseInput[]): AgentOp[];
//# sourceMappingURL=prose-diff.d.ts.map