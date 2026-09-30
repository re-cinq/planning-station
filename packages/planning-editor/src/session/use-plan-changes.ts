import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyOps,
  isPlanBlock,
  plainText,
  tableCells,
  writtenIn,
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

/** One proposed change as a person meets it: the agent's words, whether the paragraph moved on, and what they can do about it. */
export interface ReviewableChange {
  change: PlanChange;
  /** The paragraph reads differently now, so writing this would go over what someone else wrote. */
  stale: boolean;
  /** The lines a removal or a section rewrite takes out of the section as it reads now; none for any other change. */
  removes: string[];
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

/** The ops that take words out of a section rather than write over one paragraph. */
const TAKES_OUT: readonly string[] = [
  "remove-block",
  "set-section-text",
  "set-section-prose",
];

/** The section's blocks that accepting leaves out, read as they stand now. */
function removedBy(
  blocks: readonly BlockJson[],
  { op, slot }: PlanChange,
): string[] {
  if (!TAKES_OUT.includes(op.op)) {
    return [];
  }

  const kept = new Set(
    writtenIn(applyOps(blocks, [op]), slot).map((block) => block.id),
  );

  return writtenIn(blocks, slot)
    .filter((block) => !kept.has(block.id))
    .flatMap(wordsOf);
}

/** A block's own words, then its nested blocks' words, one line each; blank lines are left out. */
function wordsOf(block: BlockJson): string[] {
  const children = isPlanBlock(block) ? [] : block.children;

  return [textOf(block.content), ...children.flatMap(wordsOf)].filter(Boolean);
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
