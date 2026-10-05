import { type BlockJson } from "../blocks/block-json.js";
import type { PlanKind, PlanMeta } from "../plan/plan-meta.js";
export type SectionContent = Readonly<Record<string, readonly BlockJson[]>>;
export declare function planMeta(type: PlanKind, title?: string): PlanMeta;
export declare function seededHeadings(type: PlanKind): BlockJson[];
export declare function planWith(type: PlanKind, content: SectionContent): BlockJson[];
/** A feature plan with everything approval asks for. */
export declare function readyFeature(): BlockJson[];
/** What people wrote in a section, without its comments, panel and actions. */
export declare function writtenBlocks<Block extends {
    type: string;
}>(blocks?: readonly Block[]): Block[];
/** The text a block reads as; a table has none. */
export declare function blockText(block: BlockJson): string;
export declare function textBlock(type: string, props: Record<string, unknown>, text: string): BlockJson;
//# sourceMappingURL=plans.d.ts.map