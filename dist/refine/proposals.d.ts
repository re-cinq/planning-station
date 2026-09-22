import { type AgentOp, type BlockJson, type ProposedRefine, type RefineProposal, type RefineUses } from "@re-cinq/planning-document";
import type { Doc } from "yjs";
/** Refines live beside the plan's blocks, so everyone sees them and the plan JSON never does. */
export declare const PROPOSALS = "proposals";
export declare class NoProposalError extends Error {
}
export interface RefineAsk {
    slot: string;
    askedBy: string;
}
export interface RefineOffer {
    slot: string;
    baseHash: string;
    ops: readonly AgentOp[];
    uses: RefineUses;
    proposedBy: string;
}
export interface SectionBase {
    slot: string;
    hash: string;
}
export declare function proposalsIn(doc: Doc): RefineProposal[];
/** A person asks: the section's hash now is what the agent's answer will be checked against. */
export declare function askRefine(doc: Doc, ask: RefineAsk, origin?: unknown): {
    status: "asked";
    slot: string;
    baseHash: string;
    askedBy: string;
    askedAt: string;
};
/** The agent answers with ops for that one section, kept aside until a person accepts them. */
export declare function proposeRefine(doc: Doc, offer: RefineOffer, origin?: unknown): ProposedRefine;
export declare function discardRefine(doc: Doc, slot: string, origin?: unknown): void;
/** Writes the proposal into its section and marks what it used, unless the section changed after asking. */
export declare function acceptRefine(doc: Doc, slot: string, origin?: unknown): BlockJson[];
/** Writes the proposal in whatever the section says now: what a person chooses when they would rather have the answer than the words it was written against. */
export declare function applyRefineAnyway(doc: Doc, slot: string, origin?: unknown): BlockJson[];
export declare function enforceSectionUnchanged(doc: Doc, base: SectionBase): void;
//# sourceMappingURL=proposals.d.ts.map