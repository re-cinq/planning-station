import { PlanTemplate } from '@re-cinq/planning-document';
import { Awareness } from 'y-protocols/awareness';
export interface PresenceBarProps {
    awareness: Awareness;
    template: PlanTemplate;
}
export declare function PresenceBar({ awareness, template }: PresenceBarProps): import("react").JSX.Element;
