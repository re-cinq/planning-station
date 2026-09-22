import { type AgentOp, type BlockJson } from "@re-cinq/planning-document";
import { Doc } from "yjs";
export declare class UnseededDocError extends Error {
}
export type BlocksChange = (blocks: BlockJson[]) => BlockJson[];
export declare function applyOpsToDoc(doc: Doc, ops: readonly AgentOp[], origin?: unknown): BlockJson[];
/** Replaces only the blocks that changed, so other people's cursors survive. */
export declare function rewriteDoc(doc: Doc, change: BlocksChange, origin?: unknown): BlockJson[];
//# sourceMappingURL=apply-ops.d.ts.map