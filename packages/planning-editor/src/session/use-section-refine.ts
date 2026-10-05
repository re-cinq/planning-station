import { useEffect, useMemo, useState } from "react";
import {
  previewProposal,
  refineInputs,
  settledCount,
  usesOf,
  type ProposalPreview,
  type RefineInputs,
  type RefineProposal,
  type RefineUses,
} from "@re-cinq/planning-document";
import {
  acceptRefine,
  applyRefineAnyway,
  askRefine,
  discardRefine,
  proposalsIn,
} from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

import { blocksOf } from "./doc-blocks.js";

export interface RefineAsked {
  inputs: RefineInputs;
  uses: RefineUses;
  baseHash: string;
}

export interface SectionRefine {
  inputs: RefineInputs;
  /** Answered questions plus resolved threads: what a refine has to work with. */
  settled: number;
  proposal?: RefineProposal;
  /** Who asked the agent to refine another section, while it still works on that one: it answers one section at a time. */
  busyFor?: string;
  preview?: ProposalPreview;
  ask(askedBy: string): RefineAsked;
  accept(): void;
  /** Writes the proposal over the section as it stands, for a person who would rather have the answer than the words it was written against. */
  applyAnyway(): void;
  discard(): void;
}

/** One section's refine, read from the live document so every tab sees the same one. */
export function useSectionRefine(doc: Doc, slot: string): SectionRefine {
  const version = useDocVersion(doc);

  return useMemo(() => {
    const blocks = blocksOf(doc);
    const inputs = refineInputs(blocks, slot);
    const proposals = proposalsIn(doc);
    const proposal = proposals.find((one) => one.slot === slot);

    return {
      inputs,
      settled: settledCount(inputs),
      proposal,
      busyFor: askerElsewhere(proposals, slot),
      preview:
        proposal?.status === "proposed"
          ? previewProposal(blocks, proposal)
          : undefined,
      ...actionsFor(doc, slot, inputs),
    };
  }, [doc, slot, version]);
}

function askerElsewhere(
  proposals: readonly RefineProposal[],
  slot: string,
): string | undefined {
  const asked = proposals.find(
    (one) => one.slot !== slot && one.status === "asked",
  );

  return asked?.askedBy;
}

function actionsFor(doc: Doc, slot: string, inputs: RefineInputs) {
  return {
    ask: (askedBy: string): RefineAsked => ({
      inputs,
      uses: usesOf(inputs),
      baseHash: askRefine(doc, { slot, askedBy }).baseHash,
    }),
    accept: () => void acceptRefine(doc, slot),
    applyAnyway: () => void applyRefineAnyway(doc, slot),
    discard: () => discardRefine(doc, slot),
  };
}

function useDocVersion(doc: Doc): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const bump = () => setVersion((current) => current + 1);
    doc.on("update", bump);

    return () => doc.off("update", bump);
  }, [doc]);

  return version;
}
