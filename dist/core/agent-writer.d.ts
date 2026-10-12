import type { Hocuspocus } from "@hocuspocus/server";
import { type AgentOp, type PlanChange, type PlanDocument, type ProposedRefine, type RefineProposal, type RefineUses } from "@re-cinq/planning-document";
import { type PassOutcome, type SectionBase } from "@re-cinq/planning-yjs";
import { type EditingRequest, type PresenceRequest } from "./agent-presence.js";
import type { PlanningService } from "./planning-service.js";
export declare const AGENT_ORIGIN = "planning-agent";
export interface OpsRequest {
    planId: string;
    actor: string;
    ops: readonly AgentOp[];
    /** The section as the agent read it; the write is refused when it changed since. */
    base?: SectionBase;
    /** The block as the agent read it; the write is refused when that block changed since. */
    expect?: BlockBase;
}
/** One block as the agent read it: its id and the hash it had then. */
export interface BlockBase {
    blockId: string;
    hash: string;
}
export interface ProposalRequest {
    planId: string;
    actor: string;
    slot: string;
    baseHash: string;
    ops: readonly AgentOp[];
    uses: RefineUses;
}
/** One pass's whole answer: the Refine a person asked, and the sections the settled answers forced it to change as well. */
export interface PassRequest {
    planId: string;
    actor: string;
    asked?: {
        slot: string;
        baseHash: string;
    };
    ops: readonly AgentOp[];
    uses: RefineUses;
}
/** The planning agent's writes, into the live document. */
export interface AgentWriter {
    applyOps(request: OpsRequest): Promise<PlanDocument>;
    /** An answer to a person's Refine, kept aside until someone accepts it. */
    propose(request: ProposalRequest): Promise<ProposedRefine>;
    /** A pass's proposals, one per section it touched, each against that section as it stands. */
    proposePass(request: PassRequest): Promise<PassOutcome>;
    /** A pass's proposals, one per PARAGRAPH it changed: each is read and taken where it lands. */
    proposeChanges(request: PassRequest): Promise<PlanChange[]>;
    /** The agent could not answer a person's Refine: the ask shows as failed, with the reason, until someone asks again. Resolves to what the section holds afterwards; a proposal already there is kept. */
    failRefine(request: FailRequest): Promise<RefineProposal | undefined>;
    /** Marks what a direct edit used and clears the section's ask. */
    finishRefine(request: FinishRefineRequest): Promise<void>;
    /** Announces the agent's presence on the plan, broadcast to every viewer. */
    openPresence(request: PresenceRequest): Promise<void>;
    /** Updates which section the agent is currently working. */
    setEditing(request: EditingRequest): Promise<void>;
    /** Withdraws the agent's presence from the plan. */
    closePresence(request: {
        planId: string;
    }): Promise<void>;
}
/** Why the agent could not answer the Refine a person asked for one section. */
export interface FailRequest {
    planId: string;
    slot: string;
    reason: string;
}
/** What a direct live edit answered: the section it answered for, and what it used. */
export interface FinishRefineRequest {
    planId: string;
    slot: string;
    uses: RefineUses;
}
export interface AgentWriterOptions {
    service: PlanningService;
    collab: Hocuspocus;
}
export declare function createAgentWriter(options: AgentWriterOptions): AgentWriter;
//# sourceMappingURL=agent-writer.d.ts.map