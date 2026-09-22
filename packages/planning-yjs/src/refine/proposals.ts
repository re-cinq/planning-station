import {
  applyOps,
  enforceInSection,
  enforceTrue,
  markUsed,
  refineProposalSchema,
  SectionChangedError,
  sectionHash,
  slotOf,
  type AgentOp,
  type BlockJson,
  type ProposedRefine,
  type RefineProposal,
  type RefineUses,
} from "@re-cinq/planning-document";
import type { Doc, Map as YMap } from "yjs";

import { rewriteDoc } from "../convert/apply-ops.js";
import { readBlocks } from "../convert/plan-doc.js";

/** Refines live beside the plan's blocks, so everyone sees them and the plan JSON never does. */
export const PROPOSALS = "proposals";

export class NoProposalError extends Error {}

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
  asked?: { slot: string; baseHash: string };
  ops: readonly AgentOp[];
  uses: RefineUses;
  proposedBy: string;
}

/** Which sections the pass now proposes for, and which it left to the person already reviewing them. */
export interface PassOutcome {
  proposed: string[];
  skipped: string[];
}

export interface SectionBase {
  slot: string;
  hash: string;
}

export function proposalsIn(doc: Doc): RefineProposal[] {
  return [...proposalMap(doc).values()].flatMap((value) => {
    const parsed = refineProposalSchema.safeParse(value);

    return parsed.success ? [parsed.data] : [];
  });
}

/** A person asks: the section's hash now is what the agent's answer will be checked against. */
export function askRefine(doc: Doc, ask: RefineAsk, origin?: unknown) {
  const asked: RefineProposal = {
    status: "asked",
    ...ask,
    baseHash: sectionHash(readBlocks(doc), ask.slot),
    askedAt: new Date().toISOString(),
  };
  doc.transact(() => proposalMap(doc).set(ask.slot, asked), origin);

  return asked;
}

/** The agent answers with ops for that one section, kept aside until a person accepts them. */
export function proposeRefine(
  doc: Doc,
  offer: RefineOffer,
  origin?: unknown,
): ProposedRefine {
  enforceInSection(offer.slot, offer.ops);
  const asked = proposalFor(doc, offer.slot);
  const proposed: ProposedRefine = {
    askedBy: asked?.askedBy ?? offer.proposedBy,
    askedAt: asked?.askedAt ?? new Date().toISOString(),
    ...offer,
    ops: [...offer.ops],
    status: "proposed",
    proposedAt: new Date().toISOString(),
  };
  doc.transact(() => proposalMap(doc).set(offer.slot, proposed), origin);

  return proposed;
}

/** One pass's answer: the section a person asked about, and every other section the settled answers forced the agent to change. Each is proposed against ITSELF as it stands, so a person reviewing one section is never told about another's drift; a section whose proposal someone is already reviewing is left alone rather than replaced. */
export function proposePass(
  doc: Doc,
  pass: PassOffer,
  origin?: unknown,
): PassOutcome {
  const context: PassContext = {
    pass,
    bySlot: groupBySlot(pass.ops),
    outcome: { proposed: [], skipped: [] },
    origin,
  };
  doc.transact(() => writePass(doc, context), origin);

  return context.outcome;
}

function writePass(doc: Doc, context: PassContext): void {
  const { pass, bySlot, outcome } = context;
  const pending = new Set(proposalsIn(doc).map((proposal) => proposal.slot));

  if (pass.asked) {
    offer(doc, context, pass.asked);
  }

  rippledSlots(bySlot, pass.asked?.slot).forEach((slot) =>
    pending.has(slot)
      ? outcome.skipped.push(slot)
      : offer(doc, context, { slot }),
  );
}

/** One section's proposal: the ask's own base and uses when a person asked for it, the section as it stands and nothing used when the answers forced it. */
function offer(
  doc: Doc,
  { pass, bySlot, outcome, origin }: PassContext,
  { slot, baseHash }: { slot: string; baseHash?: string },
): void {
  proposeRefine(
    doc,
    {
      slot,
      baseHash: baseHash ?? sectionHash(readBlocks(doc), slot),
      ops: bySlot.get(slot) ?? [],
      uses: baseHash ? pass.uses : NOTHING_USED,
      proposedBy: pass.proposedBy,
    },
    origin,
  );
  outcome.proposed.push(slot);
}

interface PassContext {
  pass: PassOffer;
  bySlot: ReadonlyMap<string, AgentOp[]>;
  outcome: PassOutcome;
  origin?: unknown;
}

const NOTHING_USED: RefineUses = { questions: [], comments: [] };

/** The sections the pass changed besides the one it was asked about. */
function rippledSlots(
  bySlot: ReadonlyMap<string, AgentOp[]>,
  asked: string | undefined,
): string[] {
  return [...bySlot.keys()].filter((slot) => slot !== asked);
}

function groupBySlot(ops: readonly AgentOp[]): Map<string, AgentOp[]> {
  const bySlot = new Map<string, AgentOp[]>();

  ops.forEach((op) => {
    const slot = slotOf(op);
    bySlot.set(slot, [...(bySlot.get(slot) ?? []), op]);
  });

  return bySlot;
}

export function discardRefine(doc: Doc, slot: string, origin?: unknown): void {
  doc.transact(() => proposalMap(doc).delete(slot), origin);
}

/** Writes the proposal into its section and marks what it used, unless the section changed after asking. */
export function acceptRefine(
  doc: Doc,
  slot: string,
  origin?: unknown,
): BlockJson[] {
  const { baseHash } = proposedFor(doc, slot);
  enforceSectionUnchanged(doc, { slot, hash: baseHash });

  return applyRefineAnyway(doc, slot, origin);
}

/** Writes the proposal in whatever the section says now: what a person chooses when they would rather have the answer than the words it was written against. */
export function applyRefineAnyway(
  doc: Doc,
  slot: string,
  origin?: unknown,
): BlockJson[] {
  const { ops, uses } = proposedFor(doc, slot);
  const written: BlockJson[][] = [];
  doc.transact(() => {
    written.push(
      rewriteDoc(
        doc,
        (blocks) => markUsed(applyOps(blocks, ops), uses),
        origin,
      ),
    );
    proposalMap(doc).delete(slot);
  }, origin);

  return written[0] ?? [];
}

export function enforceSectionUnchanged(doc: Doc, base: SectionBase): void {
  enforceTrue(
    sectionHash(readBlocks(doc), base.slot) === base.hash,
    SectionChangedError,
    `${base.slot} changed after the refine was asked for`,
  );
}

function proposedFor(doc: Doc, slot: string): ProposedRefine {
  const proposal = proposalFor(doc, slot);
  enforceTrue(
    proposal?.status === "proposed",
    NoProposalError,
    `${slot} has no proposal to accept`,
  );

  return proposal as ProposedRefine;
}

function proposalFor(doc: Doc, slot: string): RefineProposal | undefined {
  return proposalsIn(doc).find((proposal) => proposal.slot === slot);
}

function proposalMap(doc: Doc): YMap<unknown> {
  return doc.getMap(PROPOSALS);
}
