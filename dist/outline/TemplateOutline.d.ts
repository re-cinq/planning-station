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
    children?: ReactNode;
}
export declare function TemplateOutline({ template, report, sections, approval, children, }: TemplateOutlineProps): import("react").JSX.Element;
