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
/** What one pass answers with: the ask it answers, if a person asked, and every op it wrote. */
export interface PassOffer {
    asked?: {
        slot: string;
        baseHash: string;
    };
    ops: readonly AgentOp[];
    uses: RefineUses;
    proposedBy: string;
}
/** Which sections the pass now proposes for, and which it left to the person already reviewing them. */
export interface PassOutcome {
    proposed: string[];
    skipped: string[];
}
/** Why the agent could not answer a section's ask. */
export interface RefineFailure {
    slot: string;
    reason: string;
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
/** The agent could not answer: an ask becomes failed, with the reason, so the person sees it and can ask again. A proposal already there is kept, since a late failure must not wipe a real answer. Returns what the slot holds afterwards — failed when this failed it — or undefined when nobody asked. */
export declare function failRefine(doc: Doc, { slot, reason }: RefineFailure, origin?: unknown): RefineProposal | undefined;
/** One pass's answer: the section a person asked about, and every other section the settled answers forced the agent to change. Each is proposed against ITSELF as it stands, so a person reviewing one section is never told about another's drift; a section whose proposal someone is already reviewing is left alone rather than replaced. */
export declare function proposePass(doc: Doc, pass: PassOffer, origin?: unknown): PassOutcome;
export declare function discardRefine(doc: Doc, slot: string, origin?: unknown): void;
/** What direct live edits answered: the section they answered for, and what they used. */
export interface FinishRequest {
    slot: string;
    uses: RefineUses;
}
/** Marks what the direct edits used and clears the section's ask, in one transaction. */
export declare function finishRefine(doc: Doc, request: FinishRequest, origin?: unknown): void;
/** Writes the proposal into its section and marks what it used, unless the section changed after asking. */
export declare function acceptRefine(doc: Doc, slot: string, origin?: unknown): BlockJson[];
/** Writes the proposal in whatever the section says now: what a person chooses when they would rather have the answer than the words it was written against. */
export declare function applyRefineAnyway(doc: Doc, slot: string, origin?: unknown): BlockJson[];
export declare function enforceSectionUnchanged(doc: Doc, base: SectionBase): void;
//# sourceMappingURL=proposals.d.ts.map