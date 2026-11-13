import { PlanTemplate, Section, ValidationPhase } from '@re-cinq/planning-document';
export type PlanSectionHeading = Pick<Section, "slot" | "title">;
export interface OutlineSection {
    slot: string;
    title: string;
    required: boolean;
    /** Whether the plan holds this section, so there is a heading to go to. */
    inPlan: boolean;
}
/** What the outline reads of the plan: its sections in document order, and the template slots it dropped. */
export interface OutlinePlan {
    sections: readonly PlanSectionHeading[];
    droppedSlots?: readonly string[];
}
/** The plan's sections in document order, the agent's own included, then any template section the plan lacks and never dropped. */
export declare function outlineSections(template: PlanTemplate, { sections, droppedSlots }: OutlinePlan, phase: ValidationPhase): OutlineSection[];
