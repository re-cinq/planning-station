import { PlanTemplate } from '@re-cinq/planning-document';
import { Awareness } from 'y-protocols/awareness';
import { PresenceUser } from './presence-users.js';
export interface ParticipantsProps {
    awareness: Awareness;
    template: PlanTemplate;
    /** Each section's title by slot, so a section the agent added reads by its name. */
    titles: ReadonlyMap<string, string>;
    /** A participant's name was clicked; only offered for one whose cursor is in the document. */
    onLocate: (user: PresenceUser) => void;
}
export declare function Participants({ awareness, ...entry }: ParticipantsProps): import("react").JSX.Element | null;
