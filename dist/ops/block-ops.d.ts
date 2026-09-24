import type { BlockJson } from "../blocks/block-json.js";
import type { AgentOp } from "./agent-ops.js";
type Handler<Kind extends AgentOp["op"]> = (blocks: readonly BlockJson[], op: Extract<AgentOp, {
    op: Kind;
}>) => BlockJson[];
export declare const replaceBlock: Handler<"replace-block">;
export declare const insertBlocks: Handler<"insert-blocks">;
export declare const removeBlock: Handler<"remove-block">;
export {};
//# sourceMappingURL=block-ops.d.ts.map