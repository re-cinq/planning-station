import { type BlockJson } from "../blocks/block-json.js";
import type { Section } from "../plan/plan-document.js";
export declare class PlanShapeError extends Error {
}
export declare const TITLE_BLOCK = "plan-title";
/** The feature name, which lives in the document above the first section. */
export declare function planTitle(blocks: readonly BlockJson[]): string | null;
export declare function partitionSections(blocks: readonly BlockJson[]): Section[];
/** A section's blocks in place: comments, its panel, what people wrote, its actions. */
export declare function sectionOrder(blocks: readonly BlockJson[]): BlockJson[];
//# sourceMappingURL=partition.d.ts.map