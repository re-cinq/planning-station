import { BlockJson, PlanChange } from '@re-cinq/planning-document';
import { Doc } from 'yjs';
/** What a change that writes no words takes out of the plan as it reads now: one block, or a section's prose. */
export type Removal = {
    takes: "block";
    type: BlockJson["type"];
    lines: string[];
} | {
    takes: "section";
    lines: string[];
};
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
export declare function usePlanChanges(doc: Doc, onRead?: () => void): ReviewableChange[];
