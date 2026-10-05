import { type BlockJson } from "../blocks/block-json.js";
import type { PlanTemplate } from "../template/template.js";
export interface SeedOptions {
    /** The feature name, which the plan carries as its title block. */
    title?: string;
    idFor?: (slot: string) => string;
}
/** A new plan: its title, then each section's heading, panel and actions. */
export declare function seedBlocks(template: PlanTemplate, options?: SeedOptions): BlockJson[];
export declare const PLAN_TITLE_ID = "plan-title";
export declare function titleBlock(title: string): BlockJson;
export declare function panelBlock(slot: string): BlockJson;
export declare function actionsBlock(slot: string): BlockJson;
//# sourceMappingURL=seed.d.ts.map