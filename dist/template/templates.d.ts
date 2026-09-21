import type { PlanKind } from "../plan/plan-meta.js";
import type { PlanTemplate, SectionSlot } from "./template.js";
export declare class UnknownSlotError extends Error {
}
export declare const TEMPLATES: Readonly<Record<PlanKind, PlanTemplate>>;
export declare function templateFor(type: PlanKind): PlanTemplate;
export declare function slotFor(template: PlanTemplate, slot: string): SectionSlot;
//# sourceMappingURL=templates.d.ts.map