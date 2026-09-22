import { Awareness } from 'y-protocols/awareness';
import { PlanBlockNoteEditor } from '../schema/block-bridge.js';
import { PresenceUser } from './presence-users.js';
export declare function usePresence(awareness: Awareness): PresenceUser[];
export declare function useTrackEditing(editor: PlanBlockNoteEditor, awareness: Awareness): void;
