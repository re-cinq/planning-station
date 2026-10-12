import type { PlanBlockKind, PROTOTYPE_MATURITIES } from "../blocks/plan-block-configs.js";
import type { ProseBlockKind } from "../blocks/prose-blocks.js";
import type { PlanKind } from "../plan/plan-meta.js";
export type BlockKind = PlanBlockKind | ProseBlockKind;
export declare const SLOT_REQUIREMENTS: readonly ["always", "for-approval", "optional"];
export type SlotRequirement = (typeof SLOT_REQUIREMENTS)[number];
export interface BlockRequirement {
    block: BlockKind;
    min: number;
    max?: number;
}
export interface SectionSlot {
    slot: string;
    title: string;
    required: SlotRequirement;
    allows: readonly BlockKind[];
    requires: readonly BlockRequirement[];
    hint: string;
}
export interface PlanTemplate {
    type: PlanKind;
    version: number;
    prototypeMinimum?: (typeof PROTOTYPE_MATURITIES)[number];
    slots: readonly SectionSlot[];
}
//# sourceMappingURL=template.d.ts.map