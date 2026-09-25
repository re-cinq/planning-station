import { applyOps, enforceInSection, enforceTrue, markUsed, refineProposalSchema, SectionChangedError, sectionHash, slotOf, } from "@re-cinq/planning-document";
import { rewriteDoc } from "../convert/apply-ops.js";
import { readBlocks } from "../convert/plan-doc.js";
/** Refines live beside the plan's blocks, so everyone sees them and the plan JSON never does. */
export const PROPOSALS = "proposals";
export class NoProposalError extends Error {
}
export function proposalsIn(doc) {
    return [...proposalMap(doc).values()].flatMap((value) => {
        const parsed = refineProposalSchema.safeParse(value);
        return parsed.success ? [parsed.data] : [];
    });
}
/** A person asks: the section's hash now is what the agent's answer will be checked against. */
export function askRefine(doc, ask, origin) {
    const asked = {
        status: "asked",
        ...ask,
        baseHash: sectionHash(readBlocks(doc), ask.slot),
        askedAt: new Date().toISOString(),
    };
    doc.transact(() => proposalMap(doc).set(ask.slot, asked), origin);
    return asked;
}
/** The agent answers with ops for that one section, kept aside until a person accepts them. */
export function proposeRefine(doc, offer, origin) {
    enforceInSection(offer.slot, offer.ops);
    const asked = proposalFor(doc, offer.slot);
    const proposed = {
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
/** The agent could not answer: an ask becomes failed, with the reason, so the person sees it and can ask again. A proposal already there is kept, since a late failure must not wipe a real answer. Returns what the slot holds afterwards — failed when this failed it — or undefined when nobody asked. */
export function failRefine(doc, { slot, reason }, origin) {
    const current = proposalFor(doc, slot);
    if (current?.status !== "asked") {
        return current;
    }
    const failed = {
        ...current,
        status: "failed",
        reason,
        failedAt: new Date().toISOString(),
    };
    doc.transact(() => proposalMap(doc).set(slot, failed), origin);
    return failed;
}
/** One pass's answer: the section a person asked about, and every other section the settled answers forced the agent to change. Each is proposed against ITSELF as it stands, so a person reviewing one section is never told about another's drift; a section whose proposal someone is already reviewing is left alone rather than replaced. */
export function proposePass(doc, pass, origin) {
    const context = {
        pass,
        bySlot: groupBySlot(pass.ops),
        outcome: { proposed: [], skipped: [] },
        origin,
    };
    doc.transact(() => writePass(doc, context), origin);
    return context.outcome;
}
function writePass(doc, context) {
    const { pass, bySlot, outcome } = context;
    const pending = new Set(proposalsIn(doc)
        .filter((proposal) => proposal.status !== "failed")
        .map((proposal) => proposal.slot));
    if (pass.asked) {
        offer(doc, context, pass.asked);
    }
    rippledSlots(bySlot, pass.asked?.slot).forEach((slot) => pending.has(slot)
        ? outcome.skipped.push(slot)
        : offer(doc, context, { slot }));
}
/** One section's proposal: the ask's own base and uses when a person asked for it, the section as it stands and nothing used when the answers forced it. */
function offer(doc, { pass, bySlot, outcome, origin }, { slot, baseHash }) {
    proposeRefine(doc, {
        slot,
        baseHash: baseHash ?? sectionHash(readBlocks(doc), slot),
        ops: bySlot.get(slot) ?? [],
        uses: baseHash ? pass.uses : NOTHING_USED,
        proposedBy: pass.proposedBy,
    }, origin);
    outcome.proposed.push(slot);
}
const NOTHING_USED = { questions: [], comments: [] };
/** The sections the pass changed besides the one it was asked about. */
function rippledSlots(bySlot, asked) {
    return [...bySlot.keys()].filter((slot) => slot !== asked);
}
function groupBySlot(ops) {
    const bySlot = new Map();
    ops.forEach((op) => {
        const slot = slotOf(op);
        bySlot.set(slot, [...(bySlot.get(slot) ?? []), op]);
    });
    return bySlot;
}
export function discardRefine(doc, slot, origin) {
    doc.transact(() => proposalMap(doc).delete(slot), origin);
}
/** Marks what the direct edits used and clears the section's ask, in one transaction. */
export function finishRefine(doc, request, origin) {
    doc.transact(() => {
        rewriteDoc(doc, (blocks) => markUsed(blocks, request.uses), origin);
        proposalMap(doc).delete(request.slot);
    }, origin);
}
/** Writes the proposal into its section and marks what it used, unless the section changed after asking. */
export function acceptRefine(doc, slot, origin) {
    const { baseHash } = proposedFor(doc, slot);
    enforceSectionUnchanged(doc, { slot, hash: baseHash });
    return applyRefineAnyway(doc, slot, origin);
}
/** Writes the proposal in whatever the section says now: what a person chooses when they would rather have the answer than the words it was written against. */
export function applyRefineAnyway(doc, slot, origin) {
    const { ops, uses } = proposedFor(doc, slot);
    const written = [];
    doc.transact(() => {
        written.push(rewriteDoc(doc, (blocks) => markUsed(applyOps(blocks, ops), uses), origin));
        proposalMap(doc).delete(slot);
    }, origin);
    return written[0] ?? [];
}
export function enforceSectionUnchanged(doc, base) {
    enforceTrue(sectionHash(readBlocks(doc), base.slot) === base.hash, SectionChangedError, `${base.slot} changed after the refine was asked for`);
}
function proposedFor(doc, slot) {
    const proposal = proposalFor(doc, slot);
    enforceTrue(proposal?.status === "proposed", NoProposalError, `${slot} has no proposal to accept`);
    return proposal;
}
function proposalFor(doc, slot) {
    return proposalsIn(doc).find((proposal) => proposal.slot === slot);
}
function proposalMap(doc) {
    return doc.getMap(PROPOSALS);
}
//# sourceMappingURL=proposals.js.map