import type { Block } from "@blocknote/core";
import { blocksToYXmlFragment } from "@blocknote/core/yjs";
import {
  applyOps,
  enforceTrue,
  PLAN_FRAGMENT,
  type AgentOp,
  type BlockJson,
} from "@re-cinq/planning-document";
import { Doc, XmlElement } from "yjs";

import { headlessConverter, readBlocks } from "./plan-doc.js";

export class UnseededDocError extends Error {}

interface Target {
  group: XmlElement;
  before: Map<string, string>;
}

export type BlocksChange = (blocks: BlockJson[]) => BlockJson[];

export function applyOpsToDoc(
  doc: Doc,
  ops: readonly AgentOp[],
  origin?: unknown,
): BlockJson[] {
  return rewriteDoc(doc, (blocks) => applyOps(blocks, ops), origin);
}

/** Replaces only the blocks that changed, so other people's cursors survive. */
export function rewriteDoc(
  doc: Doc,
  change: BlocksChange,
  origin?: unknown,
): BlockJson[] {
  const current = readBlocks(doc);
  const next = change(current);
  doc.transact(() => reconcile(doc, current, next), origin);

  return next;
}

function reconcile(
  doc: Doc,
  current: readonly BlockJson[],
  next: readonly BlockJson[],
): void {
  const group = blockGroup(doc);
  const target: Target = { group, before: fingerprints(current) };
  dropRemoved(group, new Set(next.map((block) => block.id)));
  next.forEach((block, index) => place(target, block, index));
}

function place(target: Target, block: BlockJson, index: number): void {
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

function dropRemoved(group: XmlElement, keep: ReadonlySet<string>): void {
  childIds(group)
    .map((id, index) => ({ id, index }))
    .filter((child) => !keep.has(child.id))
    .reverse()
    .forEach((child) => group.delete(child.index, 1));
}

function containerFor(block: BlockJson): XmlElement {
  const fragment = new Doc().getXmlFragment(PLAN_FRAGMENT);
  blocksToYXmlFragment(
    headlessConverter(),
    [block] as unknown as Block[],
    fragment,
  );
  const group = fragment.get(0) as XmlElement;

  return childAt(group, 0).clone();
}

function blockGroup(doc: Doc): XmlElement {
  const fragment = doc.getXmlFragment(PLAN_FRAGMENT);
  enforceTrue(
    fragment.length > 0,
    UnseededDocError,
    "this document holds no plan yet",
  );

  return fragment.get(0) as XmlElement;
}

function childIds(group: XmlElement): string[] {
  return group.toArray().map((child) => idOf(child as XmlElement));
}

function childAt(group: XmlElement, index: number): XmlElement {
  return group.get(index) as XmlElement;
}

function idOf(child: XmlElement): string {
  return String(child.getAttribute("id"));
}

function fingerprints(blocks: readonly BlockJson[]): Map<string, string> {
  return new Map(blocks.map((block) => [block.id, fingerprint(block)]));
}

function fingerprint(block: BlockJson): string {
  return JSON.stringify(block);
}
