import type { BlockJson } from "../blocks/block-json.js";
import type { Section } from "../plan/plan-document.js";
/** What a change makes of one section's blocks. */
export type Change = (section: Section) => BlockJson[];
/** Rewrites one section's blocks, leaving every other section as it is. */
export declare function inSection(blocks: readonly BlockJson[], slot: string, change: Change): BlockJson[];
/** The blocks a plan's sections make, keeping the plan's own title. */
export declare function withSections(blocks: readonly BlockJson[], sections: readonly Section[]): BlockJson[];
//# sourceMappingURL=in-section.d.ts.map