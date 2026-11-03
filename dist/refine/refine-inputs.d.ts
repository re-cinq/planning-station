import { type BlockJson } from "../blocks/block-json.js";
import type { RefineUses } from "./refine-proposal.js";
export interface AnsweredQuestion {
    questionId: string;
    question: string;
    answer: string;
}
export interface OpenQuestion {
    questionId: string;
    question: string;
}
export interface CommentThread {
    commentId: string;
    said: {
        author: string;
        text: string;
    }[];
}
/** What a section's conversation gives the agent: decisions to write in, and talk to leave alone. */
export interface RefineInputs {
    answered: AnsweredQuestion[];
    resolved: CommentThread[];
    openQuestions: OpenQuestion[];
    openThreads: CommentThread[];
}
/** Settled inputs no earlier refine used: answered questions and resolved threads. */
export declare function refineInputs(blocks: readonly BlockJson[], slot: string): RefineInputs;
export declare function settledCount(inputs: RefineInputs): number;
/** Per section, the settled input no refine has used yet. Resolving a thread or answering a question decides it, but only a refine writes it in — so a section can read as handled while nothing has been written from it. Sections with none are left out. */
export declare function settledBySlot(blocks: readonly BlockJson[], slots: readonly string[]): ReadonlyMap<string, number>;
/** The ids a proposal built from these inputs uses, so accepting it can mark them. */
export declare function usesOf(inputs: RefineInputs): RefineUses;
/** Marks what a refine used, so the next one does not write it in twice. */
export declare function markUsed(blocks: readonly BlockJson[], uses: RefineUses): BlockJson[];
//# sourceMappingURL=refine-inputs.d.ts.map