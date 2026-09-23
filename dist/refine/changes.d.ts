import { type BlockJson, type PassOps, type PlanChange } from "@re-cinq/planning-document";
import type { Doc } from "yjs";
/** Changes live beside the plan's blocks, so everyone sees them and the plan itself stays as it was until someone accepts one. */
export declare const CHANGES = "changes";
export declare class NoChangeError extends Error {
}
/** Every change waiting on this plan, in the order the pass wrote them. */
export declare function changesIn(doc: Doc): PlanChange[];
/** The changes whose own paragraph reads differently now, so accepting one would write over what someone else wrote. */
export declare function staleChanges(doc: Doc): PlanChange[];
/** One pass's answer, cut into a change per op: each is reviewed where it lands. */
export declare function proposeChanges(doc: Doc, pass: PassOps, origin?: unknown): PlanChange[];
/** Writes one change into the plan and marks what it used, unless its own paragraph moved on. */
export declare function acceptChange(doc: Doc, changeId: string, origin?: unknown): BlockJson[];
/** Writes one change onto the paragraph as it stands: what a person chooses when they would rather have the answer than the words it was written against. */
export declare function applyChangeAnyway(doc: Doc, changeId: string, origin?: unknown): BlockJson[];
export declare function discardChange(doc: Doc, changeId: string, origin?: unknown): void;
/** Drops every change waiting on one section, for a person asking the agent again. */
export declare function discardChangesIn(doc: Doc, slot: string, origin?: unknown): void;
//# sourceMappingURL=changes.d.ts.map