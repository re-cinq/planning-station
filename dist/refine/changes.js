import { applyOps, blockHash, changesFor, enforceTrue, markUsed, partitionPass, planChangeSchema, SectionChangedError, } from "@re-cinq/planning-document";
import { rewriteDoc } from "../convert/apply-ops.js";
import { readBlocks } from "../convert/plan-doc.js";
import { discardRefine } from "./proposals.js";
/** Changes live beside the plan's blocks, so everyone sees them and the plan itself stays as it was until someone accepts one. */
export const CHANGES = "changes";
export class NoChangeError extends Error {
}
/** Every change waiting on this plan, in the order the pass wrote them. */
export function changesIn(doc) {
    return [...changeMap(doc).values()].flatMap((value) => {
        const parsed = planChangeSchema.safeParse(value);
        return parsed.success ? [parsed.data] : [];
    });
}
/** The changes whose own paragraph reads differently now, so accepting one would write over what someone else wrote. */
export function staleChanges(doc) {
    const blocks = readBlocks(doc);
    return changesIn(doc).filter((change) => isStale(blocks, change));
}
/** One pass's answer: the sections it adds are written straight in, and the rest is cut into a change per op, each reviewed where it lands. The changes are cut after the write, so each hashes the plan as it now stands. */
export function proposeChanges(doc, pass, origin) {
    const changes = [];
    doc.transact(() => {
        const proposed = writeAdded(doc, pass, origin);
        changes.push(...changesFor(readBlocks(doc), { ...pass, ops: proposed }));
        changes.forEach((change) => changeMap(doc).set(change.changeId, change));
        // The ask is answered by the pass, even when it changed nothing: left standing, the plan would say a refine is still coming for ever.
        discardRefine(doc, pass.slot, origin);
    }, origin);
    return changes;
}
/** The sections a pass adds, written with what the pass put in them; the inputs are marked used so the next pass does not add them again. Answers the ops that remain to propose. */
function writeAdded(doc, pass, origin) {
    const { written, proposed } = partitionPass(pass.ops);
    if (written.length > 0) {
        rewriteDoc(doc, (blocks) => markUsed(applyOps(blocks, written), pass.uses), origin);
    }
    return proposed;
}
/** Writes one change into the plan and marks what it used, unless its own paragraph moved on. */
export function acceptChange(doc, changeId, origin) {
    const change = changeFor(doc, changeId);
    enforceTrue(!isStale(readBlocks(doc), change), SectionChangedError, `${change.slot} changed after the agent read it`);
    return applyChangeAnyway(doc, changeId, origin);
}
/** Writes one change onto the paragraph as it stands: what a person chooses when they would rather have the answer than the words it was written against. */
export function applyChangeAnyway(doc, changeId, origin) {
    const { op, uses } = changeFor(doc, changeId);
    const written = [];
    doc.transact(() => {
        written.push(rewriteDoc(doc, (blocks) => markUsed(applyOps(blocks, [op]), uses), origin));
        changeMap(doc).delete(changeId);
    }, origin);
    return written[0] ?? [];
}
export function discardChange(doc, changeId, origin) {
    doc.transact(() => changeMap(doc).delete(changeId), origin);
}
/** Drops every change waiting on one section, for a person asking the agent again. */
export function discardChangesIn(doc, slot, origin) {
    const waiting = changesIn(doc).filter((change) => change.slot === slot);
    doc.transact(() => {
        waiting.forEach((change) => changeMap(doc).delete(change.changeId));
    }, origin);
}
function isStale(blocks, change) {
    return blockHash(blocks, change.anchorId) !== change.baseHash;
}
function changeFor(doc, changeId) {
    const change = changesIn(doc).find((one) => one.changeId === changeId);
    enforceTrue(change, NoChangeError, `no change ${changeId} to write`);
    return change;
}
function changeMap(doc) {
    return doc.getMap(CHANGES);
}
//# sourceMappingURL=changes.js.map