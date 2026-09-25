import type { PlanKind } from "../plan/plan-meta.js";
import type { PlanTemplate, SectionSlot } from "./template.js";
export declare class UnknownSlotError extends Error {
}
export declare const TEMPLATES: Readonly<Record<PlanKind, PlanTemplate>>;
export declare function templateFor(type: PlanKind): PlanTemplate;
export declare function slotFor(template: PlanTemplate, slot: string): SectionSlot;
/** The slot prefix of a section the planning agent added to one plan. */
export declare const CUSTOM_SLOT_PREFIX = "custom-";
export declare function isCustomSlot(slot: string): boolean;
export declare function newCustomSlot(): string;
/** A section of the template, or one the agent added, under the title its heading carries. */
export declare function sectionSlotFor(template: PlanTemplate, slot: string, title?: string): SectionSlot;
export declare function findSectionSlot(template: PlanTemplate, slot: string, title?: string): SectionSlot | undefined;
//# sourceMappingURL=templates.d.ts.map