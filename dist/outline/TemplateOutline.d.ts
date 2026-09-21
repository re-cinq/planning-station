import { PlanTemplate, ValidationReport } from '@re-cinq/planning-document';
export interface TemplateOutlineProps {
    template: PlanTemplate;
    report: ValidationReport;
}
export declare function TemplateOutline({ template, report }: TemplateOutlineProps): import("react").JSX.Element;
