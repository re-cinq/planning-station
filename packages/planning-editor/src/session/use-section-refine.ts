import { useEffect, useMemo, useState } from "react";
import {
  previewProposal,
  refineInputs,
  settledCount,
  usesOf,
  type BlockJson,
  type ProposalPreview,
  type RefineInputs,
  type RefineProposal,
  type RefineUses,
} from "@re-cinq/planning-document";
import {
  acceptRefine,
  askRefine,
  discardRefine,
  proposalsIn,
  readBlocks,
} from "@re-cinq/planning-yjs";
import type { Doc } from "yjs";

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
  preview?: ProposalPreview;
  ask(askedBy: string): RefineAsked;
  accept(): void;
  discard(): void;
}

const blocksCache = new WeakMap<Doc, BlockJson[]>();

/** One section's refine, read from the live document so every tab sees the same one. */
export function useSectionRefine(doc: Doc, slot: string): SectionRefine {
  const version = useDocVersion(doc);

  return useMemo(() => {
    const blocks = blocksOf(doc);
    const inputs = refineInputs(blocks, slot);
    const proposal = proposalsIn(doc).find((one) => one.slot === slot);

    return {
      inputs,
      settled: settledCount(inputs),
      proposal,
      preview:
        proposal?.status === "proposed"
          ? previewProposal(blocks, proposal)
          : undefined,
      ...actionsFor(doc, slot, inputs),
    };
  }, [doc, slot, version]);
}

function actionsFor(doc: Doc, slot: string, inputs: RefineInputs) {
  return {
    ask: (askedBy: string): RefineAsked => ({
      inputs,
      uses: usesOf(inputs),
      baseHash: askRefine(doc, { slot, askedBy }).baseHash,
    }),
    accept: () => void acceptRefine(doc, slot),
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

/** Read once per change and shared by every section, instead of once per section. */
function blocksOf(doc: Doc): BlockJson[] {
  const cached = blocksCache.get(doc);

  if (cached) {
    return cached;
  }

  const blocks = readBlocks(doc);
  blocksCache.set(doc, blocks);
  doc.once("update", () => blocksCache.delete(doc));

  return blocks;
}
