import {
  applyOps,
  enforceInSection,
  enforceTrue,
  markUsed,
  refineProposalSchema,
  SectionChangedError,
  sectionHash,
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
