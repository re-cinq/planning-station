import { ReactNode } from 'react';
import { PlanTemplate, ValidationReport } from '@re-cinq/planning-document';
import { PlanSectionHeading } from './outline-sections.js';
export interface TemplateOutlineProps {
    template: PlanTemplate;
    report: ValidationReport;
    /** The plan's sections in document order; without them the outline lists the template's. */
    sections?: readonly PlanSectionHeading[];
    children?: ReactNode;
}
export declare function TemplateOutline({ template, report, sections, children, }: TemplateOutlineProps): import("react").JSX.Element;
