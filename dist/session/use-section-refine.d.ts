import { ProposalPreview, RefineInputs, RefineProposal, RefineUses } from '@re-cinq/planning-document';
import { Doc } from 'yjs';
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
    /** Writes the proposal over the section as it stands, for a person who would rather have the answer than the words it was written against. */
    applyAnyway(): void;
    discard(): void;
}
/** One section's refine, read from the live document so every tab sees the same one. */
export declare function useSectionRefine(doc: Doc, slot: string): SectionRefine;
