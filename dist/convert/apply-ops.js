import { blocksToYXmlFragment } from "@blocknote/core/yjs";
import { applyOps, enforceTrue, PLAN_FRAGMENT, } from "@re-cinq/planning-document";
import { Doc, XmlElement } from "yjs";
import { headlessConverter, readBlocks } from "./plan-doc.js";
export class UnseededDocError extends Error {
}
export function applyOpsToDoc(doc, ops, origin) {
    return rewriteDoc(doc, (blocks) => applyOps(blocks, ops), origin);
}
/** Replaces only the blocks that changed, so other people's cursors survive. */
export function rewriteDoc(doc, change, origin) {
    const current = readBlocks(doc);
    const next = change(current);
    doc.transact(() => reconcile(doc, current, next), origin);
    return next;
}
// One walk over the children, writing each run of changed blocks with one conversion and one insert: an insert per block walks the list each time, which made a plan of 40 000 paragraphs take 19 s.
function reconcile(doc, current, next) {
    const group = blockGroup(doc);
    dropRemoved(group, new Set(next.map((block) => block.id)));
    runsOf(childIds(group), fingerprints(current), next).forEach((run) => write(group, run));
}
/** The runs that turn the children, in order, into `next`, each between two blocks that stay as they are. */
/** Exported for its own test: writing a run of changed blocks as ONE insert is what keeps a write proportional to the plan — an insert per block walks the child list every time, and 40 000 paragraphs took 19 s that way. */
export function runsOf(existing, before, next) {
    const walk = { existing, before, runs: [], run: runAt(0), cursor: 0 };
    next.forEach((block, index) => pass(walk, block, index));
    const { runs, run, cursor } = walk;
    // What the walk never reached is a block the new plan holds elsewhere; left in place it would be there twice.
    return [
        ...runs,
        { ...run, replaced: run.replaced + existing.length - cursor },
    ];
}
function pass(walk, block, index) {
    const replaced = walk.existing[walk.cursor] === block.id ? 1 : 0;
    const kept = replaced === 1 && walk.before.get(block.id) === fingerprint(block);
    walk.cursor += replaced;
    if (kept) {
        closeRun(walk, index + 1);
        return;
    }
    gather(walk.run, block, replaced);
}
/** An unchanged block ends the run before it; the next one starts after it. */
function closeRun(walk, nextAt) {
    walk.runs.push(walk.run);
    walk.run = runAt(nextAt);
}
/** A changed block joins the run, taking with it the child it replaces, if any. */
function gather(run, block, replaced) {
    run.blocks.push(block);
    run.replaced += replaced;
}
function runAt(at) {
    return { at, replaced: 0, blocks: [] };
}
function write(group, { at, replaced, blocks }) {
    if (replaced > 0) {
        group.delete(at, replaced);
    }
    if (blocks.length > 0) {
        group.insert(at, containersFor(blocks));
    }
}
function dropRemoved(group, keep) {
    childIds(group)
        .map((id, index) => ({ id, index }))
        .filter((child) => !keep.has(child.id))
        .reverse()
        .forEach((child) => group.delete(child.index, 1));
}
function containersFor(blocks) {
    const fragment = new Doc().getXmlFragment(PLAN_FRAGMENT);
    blocksToYXmlFragment(headlessConverter(), blocks, fragment);
    const converted = fragment.get(0);
    return converted.toArray().map((child) => child.clone());
}
function blockGroup(doc) {
    const fragment = doc.getXmlFragment(PLAN_FRAGMENT);
    enforceTrue(fragment.length > 0, UnseededDocError, "this document holds no plan yet");
    return fragment.get(0);
}
function childIds(group) {
    return group.toArray().map((child) => idOf(child));
}
function idOf(child) {
    return String(child.getAttribute("id"));
}
function fingerprints(blocks) {
    return new Map(blocks.map((block) => [block.id, fingerprint(block)]));
}
function fingerprint(block) {
    return JSON.stringify(block);
}
//# sourceMappingURL=apply-ops.js.map