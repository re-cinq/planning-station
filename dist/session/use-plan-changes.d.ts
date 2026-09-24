import { PlanChange } from '@re-cinq/planning-document';
import { Doc } from 'yjs';
/** One proposed change as a person meets it: the agent's words, whether the paragraph moved on, and what they can do about it. */
export interface ReviewableChange {
    change: PlanChange;
    /** The paragraph reads differently now, so writing this would go over what someone else wrote. */
    stale: boolean;
    write(): void;
    discard(): void;
}
/** Every change waiting on the plan, re-read as they arrive, each bound to what it writes. */
export declare function usePlanChanges(doc: Doc, onRead?: () => void): ReviewableChange[];
