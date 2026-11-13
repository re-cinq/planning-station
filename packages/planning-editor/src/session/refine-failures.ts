import { useEffect, useMemo, useRef } from "react";
import type { RefineProposal } from "@re-cinq/planning-document";
import { proposalsIn } from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

import { useDocVersion } from "./use-doc-version.js";

/** A section whose last refine failed, with the agent's reason. */
export interface RefineFailure {
  slot: string;
  title: string;
  reason: string;
}

export function refineFailuresIn(
  proposals: readonly RefineProposal[],
  titles: ReadonlyMap<string, string>,
): RefineFailure[] {
  return proposals.flatMap((proposal) =>
    proposal.status === "failed"
      ? [
          {
            slot: proposal.slot,
            title: titles.get(proposal.slot) ?? proposal.slot,
            reason: proposal.reason,
          },
        ]
      : [],
  );
}

/** The failed refines of the live document, reported to the host once on mount and again only when the list itself changes. */
export function useRefineFailures(
  doc: Doc,
  titles: ReadonlyMap<string, string>,
  onRefineFailures?: (failures: readonly RefineFailure[]) => void,
): ReadonlyMap<string, string> {
  const version = useDocVersion(doc);
  const failures = useMemo(
    () => refineFailuresIn(proposalsIn(doc), titles),
    // `version` is how a change inside the doc reaches this memo.
    [doc, titles, version],
  );
  useReportOnChange(failures, onRefineFailures);

  return useMemo(
    () => new Map(failures.map(({ slot, reason }) => [slot, reason])),
    [failures],
  );
}

function useReportOnChange(
  failures: readonly RefineFailure[],
  report?: (failures: readonly RefineFailure[]) => void,
): void {
  const reportedKey = useRef<string | undefined>(undefined);
  const key = JSON.stringify(failures);

  useEffect(() => {
    if (reportedKey.current === key) {
      return;
    }

    reportedKey.current = key;
    report?.(failures);
  });
}
