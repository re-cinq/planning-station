import { type AgentOp, type BlockJson } from "@re-cinq/planning-document";
import { Doc } from "yjs";
export declare class UnseededDocError extends Error {
}
/** Blocks written as one insert where the old ones at that position were deleted: a run between two unchanged blocks. */
interface Run {
    at: number;
    replaced: number;
    blocks: BlockJson[];
}
export type BlocksChange = (blocks: BlockJson[]) => BlockJson[];
export declare function applyOpsToDoc(doc: Doc, ops: readonly AgentOp[], origin?: unknown): BlockJson[];
/** Replaces only the blocks that changed, so other people's cursors survive. */
export declare function rewriteDoc(doc: Doc, change: BlocksChange, origin?: unknown): BlockJson[];
/** The runs that turn the children, in order, into `next`, each between two blocks that stay as they are. */
/** Exported for its own test: writing a run of changed blocks as ONE insert is what keeps a write proportional to the plan — an insert per block walks the child list every time, and 40 000 paragraphs took 19 s that way. */
export declare function runsOf(existing: readonly string[], before: ReadonlyMap<string, string>, next: readonly BlockJson[]): Run[];
export {};
//# sourceMappingURL=apply-ops.d.ts.map