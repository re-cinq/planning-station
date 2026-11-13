import { RefineProposal } from '@re-cinq/planning-document';
import { Doc } from 'yjs';
/** A section whose last refine failed, with the agent's reason. */
export interface RefineFailure {
    slot: string;
    title: string;
    reason: string;
}
export declare function refineFailuresIn(proposals: readonly RefineProposal[], titles: ReadonlyMap<string, string>): RefineFailure[];
/** The failed refines of the live document, reported to the host once on mount and again only when the list itself changes. */
export declare function useRefineFailures(doc: Doc, titles: ReadonlyMap<string, string>, onRefineFailures?: (failures: readonly RefineFailure[]) => void): ReadonlyMap<string, string>;
