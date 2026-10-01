import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyOps,
  changeWords,
  isPlanBlock,
  partitionSections,
  plainText,
  tableCells,
  type BlockJson,
  type PlanChange,
} from "@re-cinq/planning-document";
import {
  acceptChange,
  applyChangeAnyway,
  changesIn,
  discardChange,
  staleChanges,
} from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

import { blocksOf } from "./doc-blocks.js";

/** What a change that writes no words takes out of the plan as it reads now: one block, or a section's prose. */
export type Removal =
  | { takes: "block"; type: BlockJson["type"]; lines: string[] }
  | { takes: "section"; lines: string[] };

/** One proposed change as a person meets it: the agent's words, whether the paragraph moved on, and what they can do about it. */
export interface ReviewableChange {
  change: PlanChange;
  /** The paragraph reads differently now, so writing this would go over what someone else wrote. */
  stale: boolean;
  /** Only for a removal or a section rewrite that writes nothing: what it takes out, so the card can show it. */
  removes?: Removal;
  write(): void;
  discard(): void;
}

/** Every change waiting on the plan, re-read as they arrive, each bound to what it writes. */
export function usePlanChanges(
  doc: Doc,
  onRead?: () => void,
): ReviewableChange[] {
  const version = useDocVersion(doc, onRead);

  return useMemo(() => reviewable(doc), [doc, version]);
}

function reviewable(doc: Doc): ReviewableChange[] {
  const stale = new Set(staleChanges(doc).map((one) => one.changeId));
  const blocks = blocksOf(doc);

  return changesIn(doc).map((change) => ({
    change,
    stale: stale.has(change.changeId),
    removes: removedBy(blocks, change),
    write: () =>
      stale.has(change.changeId)
        ? applyChangeAnyway(doc, change.changeId)
        : acceptChange(doc, change.changeId),
    discard: () => discardChange(doc, change.changeId),
  }));
}

type RemovalReader = (
  blocks: readonly BlockJson[],
  change: PlanChange,
) => Removal | undefined;

/** The ops that take words out of a section rather than write over one paragraph. */
const REMOVALS: Partial<Record<PlanChange["op"]["op"], RemovalReader>> = {
  "remove-block": blockRemoval,
  "set-section-text": sectionRemoval,
  "set-section-prose": sectionRemoval,
};

/** What the change takes out, read only when its card would show it: when it writes no words of its own. */
function removedBy(
  blocks: readonly BlockJson[],
  change: PlanChange,
): Removal | undefined {
  const read = REMOVALS[change.op.op];

  return read && changeWords(change).length === 0
    ? read(blocks, change)
    : undefined;
}

/** The block the removal is about, wherever it sits now: nested under another block or moved to another section, it still hosts the card. */
function blockRemoval(
  blocks: readonly BlockJson[],
  change: PlanChange,
): Removal | undefined {
  const block = blocks
    .flatMap(descendants)
    .find((candidate) => candidate.id === change.anchorId);

  return block && { takes: "block", type: block.type, lines: wordsOf(block) };
}

/** The section's blocks that accepting leaves out, read as they stand now. */
function sectionRemoval(
  blocks: readonly BlockJson[],
  { op, slot }: PlanChange,
): Removal {
  const kept = new Set(
    sectionBlocks(applyOps(blocks, [op]), slot).map((block) => block.id),
  );

  return {
    takes: "section",
    lines: sectionBlocks(blocks, slot)
      .filter((block) => !kept.has(block.id))
      .flatMap(wordsOf),
  };
}

function sectionBlocks(
  blocks: readonly BlockJson[],
  slot: string,
): BlockJson[] {
  const section = partitionSections(blocks).find(
    (candidate) => candidate.slot === slot,
  );

  return section?.blocks ?? [];
}

function descendants(block: BlockJson): BlockJson[] {
  return [block, ...childrenOf(block).flatMap(descendants)];
}

function childrenOf(block: BlockJson): BlockJson[] {
  return isPlanBlock(block) ? [] : block.children;
}

/** A block's own words, then its nested blocks' words, one line each; blank lines are left out. */
function wordsOf(block: BlockJson): string[] {
  return [textOf(block.content), ...childrenOf(block).flatMap(wordsOf)].filter(
    Boolean,
  );
}

/** A table reads as its cells on one line. */
function textOf(content: BlockJson["content"]): string {
  return Array.isArray(content)
    ? plainText(content)
    : tableCells(content).flat().map(plainText).join(" · ");
}

/** Bumps on every document update, so the changes are read again as the agent writes them. The caller's `onRead` is held in a ref: taken as a dependency it would re-subscribe on every render, and each subscription reads again — a render loop that also dispatched an editor transaction each time round. */
function useDocVersion(doc: Doc, onRead?: () => void): number {
  const [version, setVersion] = useState(0);
  const latest = useRef(onRead);
  latest.current = onRead;

  useEffect(() => {
    const read = () => {
      setVersion((one) => one + 1);
      latest.current?.();
    };

    doc.on("update", read);
    read();

    return () => doc.off("update", read);
  }, [doc]);

  return version;
}
