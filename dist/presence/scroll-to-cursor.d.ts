import { PlanBlockNoteEditor } from '../schema/block-bridge.js';
/** Brings a participant's cursor into view: the cursor plugin already places one widget per remote client, keyed by client id, so its position is read off that decoration instead of resolving the relative position a second time. */
export declare function scrollToCursor(editor: PlanBlockNoteEditor, clientId: number): void;
