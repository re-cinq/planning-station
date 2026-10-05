import { PlanTemplate, Section, ValidationPhase } from '@re-cinq/planning-document';
export type PlanSectionHeading = Pick<Section, "slot" | "title">;
export interface OutlineSection {
    slot: string;
    title: string;
    required: boolean;
    /** Whether the plan holds this section, so there is a heading to go to. */
    inPlan: boolean;
}
/** The plan's sections in document order, the agent's own included, then any template section the plan lacks. */
export declare function outlineSections(template: PlanTemplate, sections: readonly PlanSectionHeading[], phase: ValidationPhase): OutlineSection[];
