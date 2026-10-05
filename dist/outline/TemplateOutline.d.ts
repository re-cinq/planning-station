import { ReactNode } from 'react';
import { PlanMeta, PlanTemplate, ValidationReport } from '@re-cinq/planning-document';
import { PlanSectionHeading } from './outline-sections.js';
export interface TemplateOutlineProps {
    template: PlanTemplate;
    report: ValidationReport;
    /** The plan's sections in document order; without them the outline lists the template's. */
    sections?: readonly PlanSectionHeading[];
    /** Once the plan is approved, the outline says by whom instead of whether it is ready. */
    approval?: PlanMeta["approval"];
    /** Per slot, settled input no refine has used. Resolving a thread decides it; only a refine writes it in, so without this the outline reads as handled while nothing was written. */
    settled?: ReadonlyMap<string, number>;
    /** Brings a section's heading into view; without it the titles are plain text. */
    onLocate?: (slot: string) => void;
    children?: ReactNode;
}
export declare function TemplateOutline({ approval, children, ...slots }: TemplateOutlineProps): import("react").JSX.Element;
