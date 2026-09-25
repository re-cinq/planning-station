import type { Document, Hocuspocus } from "@hocuspocus/server";
import {
  blockHash,
  enforceTrue,
  SectionChangedError,
  toPlanDocument,
  type AgentOp,
  type PlanChange,
  type PlanDocument,
  type PlanMeta,
  type ProposedRefine,
  type RefineProposal,
  type RefineUses,
} from "@re-cinq/planning-document";
import {
  applyOpsToDoc,
  enforceSectionUnchanged,
  failRefine,
  finishRefine,
  proposeChanges,
  proposePass,
  proposeRefine,
  readBlocks,
  type PassOutcome,
  type SectionBase,
} from "@re-cinq/planning-yjs";

import {
  createAgentPresence,
  type AgentPresence,
  type EditingRequest,
  type PresenceRequest,
} from "./agent-presence.js";
import { openPlanConnection, transactOn } from "./plan-connection.js";
import type { PlanningService } from "./planning-service.js";

export const AGENT_ORIGIN = "planning-agent";

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
  closePresence(request: { planId: string }): Promise<void>;
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

interface WriterContext extends AgentWriterOptions {
  presence: AgentPresence;
}

export function createAgentWriter(options: AgentWriterOptions): AgentWriter {
  const presence = createAgentPresence(options);

  return {
    applyOps: (request) => write({ ...options, presence }, request),
    propose: (request) => propose(options, request),
    proposePass: (request) => pass(options, request),
    proposeChanges: (request) => changes(options, request),
    failRefine: (request) => fail(options, request),
    finishRefine: (request) => finish(options, request),
    openPresence: (request) => presence.open(request),
    setEditing: (request) => presence.setEditing(request),
    closePresence: (request) => presence.close(request),
  };
}

async function write(
  context: WriterContext,
  request: OpsRequest,
): Promise<PlanDocument> {
  const { json } = await context.service.readPlan(request.planId);
  const blocks = await inHeldOrFreshDocument(context, json, (document) => {
    enforceBase(document, request.base);
    enforceBlock(document, request.expect);

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

async function changes(
  options: AgentWriterOptions,
  { planId, actor, asked, ops, uses }: PassRequest,
): Promise<PlanChange[]> {
  const { json } = await options.service.readPlan(planId);

  return inDocument(options, json, (document) =>
    proposeChanges(
      document,
      { slot: asked?.slot ?? "", ops, uses, proposedBy: actor },
      AGENT_ORIGIN,
    ),
  );
}

async function fail(
  options: AgentWriterOptions,
  { planId, ...failure }: FailRequest,
): Promise<RefineProposal | undefined> {
  const { json } = await options.service.readPlan(planId);

  return inDocument(options, json, (document) =>
    failRefine(document, failure, AGENT_ORIGIN),
  );
}

async function finish(
  options: AgentWriterOptions,
  { planId, ...request }: FinishRefineRequest,
): Promise<void> {
  const { json } = await options.service.readPlan(planId);

  await inDocument(options, json, (document) =>
    finishRefine(document, request, AGENT_ORIGIN),
  );
}

function enforceBase(document: Document, base?: SectionBase): void {
  if (base) {
    enforceSectionUnchanged(document, base);
  }
}

function enforceBlock(document: Document, expect?: BlockBase): void {
  if (!expect) return;

  enforceTrue(
    blockHash(readBlocks(document), expect.blockId) === expect.hash,
    SectionChangedError,
    `block ${expect.blockId} changed after the agent read it`,
  );
}

async function inHeldOrFreshDocument<Result>(
  context: WriterContext,
  meta: PlanMeta,
  work: (document: Document) => Result,
): Promise<Result> {
  const held = context.presence.heldConnection(meta.id);

  return held ? transactOn(held, work) : inDocument(context, meta, work);
}

async function inDocument<Result>(
  options: AgentWriterOptions,
  meta: PlanMeta,
  work: (document: Document) => Result,
): Promise<Result> {
  const connection = await openPlanConnection(options.collab, meta);

  try {
    return await transactOn(connection, work);
  } finally {
    await connection.disconnect();
  }
}
