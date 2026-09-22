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
function reconcile(doc, current, next) {
    const group = blockGroup(doc);
    const target = { group, before: fingerprints(current) };
    dropRemoved(group, new Set(next.map((block) => block.id)));
    next.forEach((block, index) => place(target, block, index));
}
function place(target, block, index) {
    const { group } = target;
    const existing = index < group.length ? childAt(group, index) : undefined;
    const sameBlock = existing && idOf(existing) === block.id;
    if (sameBlock && target.before.get(block.id) === fingerprint(block)) {
        return;
    }
    if (sameBlock) {
        group.delete(index, 1);
    }
    group.insert(index, [containerFor(block)]);
}
function dropRemoved(group, keep) {
    childIds(group)
        .map((id, index) => ({ id, index }))
        .filter((child) => !keep.has(child.id))
        .reverse()
        .forEach((child) => group.delete(child.index, 1));
}
function containerFor(block) {
    const fragment = new Doc().getXmlFragment(PLAN_FRAGMENT);
    blocksToYXmlFragment(headlessConverter(), [block], fragment);
    const group = fragment.get(0);
    return childAt(group, 0).clone();
}
function blockGroup(doc) {
    const fragment = doc.getXmlFragment(PLAN_FRAGMENT);
    enforceTrue(fragment.length > 0, UnseededDocError, "this document holds no plan yet");
    return fragment.get(0);
}
function childIds(group) {
    return group.toArray().map((child) => idOf(child));
}
function childAt(group, index) {
    return group.get(index);
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