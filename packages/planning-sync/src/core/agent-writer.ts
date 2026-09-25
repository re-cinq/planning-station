import type { Document, Hocuspocus } from "@hocuspocus/server";
import {
  blockHash,
  docName,
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

import type { PlanningService } from "./planning-service.js";

export const AGENT_ORIGIN = "planning-agent";

export interface OpsRequest {
  planId: string;
  actor: string;
  ops: readonly AgentOp[];
  /** The section as the agent read it; the write is refused when it changed since. */
  base?: SectionBase;
  /** The block as the agent read it; the write is refused when that block changed since. */
  expect?: { blockId: string; hash: string };
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

export interface PresenceUser {
  name: string;
  color: string;
}

export interface PresenceRequest {
  planId: string;
  user: PresenceUser;
}

export interface EditingRequest {
  planId: string;
  slot: string | null;
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

type PresenceConnection = Awaited<
  ReturnType<Hocuspocus["openDirectConnection"]>
>;

export function createAgentWriter(options: AgentWriterOptions): AgentWriter {
  const presences = new Map<string, PresenceConnection>();

  return {
    applyOps: (request) => write(options, request),
    propose: (request) => propose(options, request),
    proposePass: (request) => pass(options, request),
    proposeChanges: (request) => changes(options, request),
    failRefine: (request) => fail(options, request),
    finishRefine: (request) => finish(options, request),
    openPresence: (request) => openPresence(options, presences, request),
    setEditing: (request) => setEditing(presences, request),
    closePresence: (request) => closePresence(presences, request),
  };
}

async function openPresence(
  options: AgentWriterOptions,
  presences: Map<string, PresenceConnection>,
  { planId, user }: PresenceRequest,
): Promise<void> {
  const { json } = await options.service.readPlan(planId);
  const name = docName({ repo: json.repo, planId: json.id });
  const connection = await options.collab.openDirectConnection(name);

  enforceTrue(
    connection.document !== null,
    Error,
    `no document to broadcast presence on for plan ${planId}`,
  );
  presences.set(planId, connection);
  connection.document?.awareness?.setLocalState({
    user,
    editing: { slot: null },
  });
}

async function setEditing(
  presences: Map<string, PresenceConnection>,
  { planId, slot }: EditingRequest,
): Promise<void> {
  const connection = presences.get(planId);
  connection?.document?.awareness?.setLocalStateField("editing", { slot });
}

async function closePresence(
  presences: Map<string, PresenceConnection>,
  { planId }: { planId: string },
): Promise<void> {
  const connection = presences.get(planId);
  if (!connection) return;

  connection.document?.awareness?.setLocalState(null);
  await connection.disconnect();
  presences.delete(planId);
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

async function write(
  options: AgentWriterOptions,
  request: OpsRequest,
): Promise<PlanDocument> {
  const { json } = await options.service.readPlan(request.planId);
  const blocks = await inDocument(options, json, (document) => {
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

function enforceBase(document: Document, base?: SectionBase): void {
  if (base) {
    enforceSectionUnchanged(document, base);
  }
}

function enforceBlock(
  document: Document,
  expect?: { blockId: string; hash: string },
): void {
  if (!expect) return;

  enforceTrue(
    blockHash(readBlocks(document), expect.blockId) === expect.hash,
    SectionChangedError,
    `block ${expect.blockId} changed after the agent read it`,
  );
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
