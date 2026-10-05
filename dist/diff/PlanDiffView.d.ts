import { PlanDocument } from '@re-cinq/planning-document';
export interface PlanDiffViewProps {
    before: PlanDocument;
    after: PlanDocument;
    className?: string;
}
/** What one version of a plan changed against another, for a reader. */
export declare function PlanDiffView({ before, after, className }: PlanDiffViewProps): import("react").JSX.Element;
