import { PlanTemplate } from '@re-cinq/planning-document';
import { ColorClaim } from './palette.js';
export interface PresenceUser {
    clientId: number;
    /** The person, shared by all their tabs; a peer that announced none is its client. */
    id: string;
    name: string;
    color: string;
    slot: string | null;
    /** Whether the person has placed a cursor in the document, which is when the entry offers to scroll to it. */
    hasCursor: boolean;
}
interface AnnouncedUser {
    id?: unknown;
    name?: unknown;
    color?: unknown;
    joinedAt?: unknown;
}
export interface AwarenessState {
    user?: AnnouncedUser;
    editing?: {
        slot?: unknown;
    };
    /** Set by the editor's collaboration cursor plugin once a selection exists. */
    cursor?: unknown;
}
export declare function presenceUsers(states: ReadonlyMap<number, AwarenessState>, selfId: number): PresenceUser[];
/** Everyone's claim on a color, the viewer's own included, so every client settles on the same assignment. */
export declare function colorClaims(states: ReadonlyMap<number, AwarenessState>): ColorClaim[];
/** The color the viewer should announce now, or nothing when it already announces it. */
export declare function ownColorChange(states: ReadonlyMap<number, AwarenessState>, selfId: number): string | undefined;
/** "Ana in Success criteria": the section is resolved like the editor's own, so one the agent added reads by its title. */
export declare function presenceLabel(user: PresenceUser, template: PlanTemplate, titles: ReadonlyMap<string, string>): string;
export {};
