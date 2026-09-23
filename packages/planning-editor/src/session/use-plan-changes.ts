import { useEffect, useMemo, useRef, useState } from "react";
import type { PlanChange } from "@re-cinq/planning-document";
import {
  acceptChange,
  applyChangeAnyway,
  changesIn,
  discardChange,
  staleChanges,
} from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

/** One proposed change as a person meets it: the agent's words, whether the paragraph moved on, and what they can do about it. */
export interface ReviewableChange {
  change: PlanChange;
  /** The paragraph reads differently now, so writing this would go over what someone else wrote. */
  stale: boolean;
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

  return changesIn(doc).map((change) => ({
    change,
    stale: stale.has(change.changeId),
    write: () =>
      stale.has(change.changeId)
        ? applyChangeAnyway(doc, change.changeId)
        : acceptChange(doc, change.changeId),
    discard: () => discardChange(doc, change.changeId),
  }));
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
