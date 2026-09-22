import type { Document, Hocuspocus } from "@hocuspocus/server";
import {
  docName,
  toPlanDocument,
  type AgentOp,
  type PlanDocument,
  type PlanMeta,
  type ProposedRefine,
  type RefineUses,
} from "@re-cinq/planning-document";
import {
  applyOpsToDoc,
  enforceSectionUnchanged,
  proposePass,
  proposeRefine,
  type PassOutcome,
  type SectionBase,
} from "@re-cinq/planning-yjs";

import type { PlanningService } from "./planning-service.js";

export const AGENT_ORIGIN = "planning-agent";

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
  asked?: { slot: string; baseHash: string };
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
}

export interface AgentWriterOptions {
  service: PlanningService;
  collab: Hocuspocus;
}

export function createAgentWriter(options: AgentWriterOptions): AgentWriter {
  return {
    applyOps: (request) => write(options, request),
    propose: (request) => propose(options, request),
    proposePass: (request) => pass(options, request),
  };
}

async function write(
  options: AgentWriterOptions,
  request: OpsRequest,
): Promise<PlanDocument> {
  const { json } = await options.service.readPlan(request.planId);
  const blocks = await inDocument(options, json, (document) => {
    enforceBase(document, request.base);

    return applyOpsToDoc(document, request.ops, AGENT_ORIGIN);
  });

  return toPlanDocument(blocks, json);
}

async function propose(
  options: AgentWriterOptions,
  { planId, actor, ...offer }: ProposalRequest,
): Promise<ProposedRefine> {
  const { json } = await options.service.readPlan(planId);

  return inDocument(options, json, (document) =>
    proposeRefine(document, { ...offer, proposedBy: actor }, AGENT_ORIGIN),
  );
}

async function pass(
  options: AgentWriterOptions,
  { planId, actor, ...offer }: PassRequest,
): Promise<PassOutcome> {
  const { json } = await options.service.readPlan(planId);

  return inDocument(options, json, (document) =>
    proposePass(document, { ...offer, proposedBy: actor }, AGENT_ORIGIN),
  );
}

function enforceBase(document: Document, base?: SectionBase): void {
  if (base) {
    enforceSectionUnchanged(document, base);
  }
}

async function inDocument<Result>(
  options: AgentWriterOptions,
  meta: PlanMeta,
  work: (document: Document) => Result,
): Promise<Result> {
  const name = docName({ repo: meta.repo, planId: meta.id });
  const connection = await options.collab.openDirectConnection(name);
  const results: Result[] = [];

  try {
    await connection.transact((document) => results.push(work(document)));
  } finally {
    await connection.disconnect();
  }

  return results[0] as Result;
}
