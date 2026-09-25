import type { Hocuspocus } from "@hocuspocus/server";
import { type AgentOp, type PlanChange, type PlanDocument, type ProposedRefine, type RefineProposal, type RefineUses } from "@re-cinq/planning-document";
import { type PassOutcome, type SectionBase } from "@re-cinq/planning-yjs";
import type { PlanningService } from "./planning-service.js";
export declare const AGENT_ORIGIN = "planning-agent";
export interface OpsRequest {
    planId: string;
    actor: string;
    ops: readonly AgentOp[];
    /** The section as the agent read it; the write is refused when it changed since. */
    base?: SectionBase;
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
}
/** Why the agent could not answer the Refine a person asked for one section. */
export interface FailRequest {
    planId: string;
    slot: string;
    reason: string;
}
export interface AgentWriterOptions {
    service: PlanningService;
    collab: Hocuspocus;
}
export declare function createAgentWriter(options: AgentWriterOptions): AgentWriter;
//# sourceMappingURL=agent-writer.d.ts.map