import type { Hocuspocus } from "@hocuspocus/server";
import { type AgentOp, type PlanDocument, type ProposedRefine, type RefineUses } from "@re-cinq/planning-document";
import { type SectionBase } from "@re-cinq/planning-yjs";
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
/** The planning agent's writes, into the live document. */
export interface AgentWriter {
    applyOps(request: OpsRequest): Promise<PlanDocument>;
    /** An answer to a person's Refine, kept aside until someone accepts it. */
    propose(request: ProposalRequest): Promise<ProposedRefine>;
}
export interface AgentWriterOptions {
    service: PlanningService;
    collab: Hocuspocus;
}
export declare function createAgentWriter(options: AgentWriterOptions): AgentWriter;
//# sourceMappingURL=agent-writer.d.ts.map