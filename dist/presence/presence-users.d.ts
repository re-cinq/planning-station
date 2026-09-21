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
export {};
