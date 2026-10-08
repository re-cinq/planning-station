import { Awareness } from 'y-protocols/awareness';
import { PlanBlockNoteEditor } from '../schema/block-bridge.js';
import { PresenceUser } from './presence-users.js';
export declare function usePresence(awareness: Awareness): PresenceUser[];
/** Everything this client shares with the others on the plan: where it is editing, its color, and theirs on its screen. */
export declare function useSharedPresence(editor: PlanBlockNoteEditor, awareness: Awareness): void;
