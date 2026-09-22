import { PlanTemplate } from '@re-cinq/planning-document';
import { Awareness } from 'y-protocols/awareness';
export interface PresenceBarProps {
    awareness: Awareness;
    template: PlanTemplate;
    /** Each section's title by slot, so a section the agent added reads by its name. */
    titles: ReadonlyMap<string, string>;
}
export declare function PresenceBar({ awareness, template, titles }: PresenceBarProps): import("react").JSX.Element;
