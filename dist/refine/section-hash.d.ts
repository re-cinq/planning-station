import type { BlockJson } from "../blocks/block-json.js";
/** The conversation about a section: a refine reads it, and never rewrites it. */
export declare const CONVERSATION: readonly string[];
export declare class SectionChangedError extends Error {
}
/** What a refine would rewrite in a section, as a hash: its written blocks, not the talk about them. */
export declare function sectionHash(blocks: readonly BlockJson[], slot: string): string;
export declare function writtenIn(blocks: readonly BlockJson[], slot: string): BlockJson[];
//# sourceMappingURL=section-hash.d.ts.map