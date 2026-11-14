import type { BlockJson } from "../blocks/block-json.js";
import type { AgentOp } from "./agent-ops.js";
/** The section goes whole, and the plan remembers its slot so nothing asks for it again. */
export declare function removeSection(blocks: BlockJson[], op: Extract<AgentOp, {
    op: "remove-section";
}>): BlockJson[];
//# sourceMappingURL=remove-section.d.ts.map