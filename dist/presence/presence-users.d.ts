import { PlanTemplate } from '@re-cinq/planning-document';
export interface PresenceUser {
    clientId: number;
    name: string;
    color: string;
    slot: string | null;
}
interface AnnouncedUser {
    name?: unknown;
    color?: unknown;
}
export interface AwarenessState {
    user?: AnnouncedUser;
    editing?: {
        slot?: unknown;
    };
}
export declare function presenceUsers(states: ReadonlyMap<number, AwarenessState>, selfId: number): PresenceUser[];
/** "Ana in Success criteria": the section is resolved like the editor's own, so one the agent added reads by its title. */
export declare function presenceLabel(user: PresenceUser, template: PlanTemplate, titles: ReadonlyMap<string, string>): string;
export {};
