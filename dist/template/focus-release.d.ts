import { EditorView } from 'prosemirror-view';
/** A press the editor ignores still moves the person's attention away from where the caret was, so the editor lets go of focus: the next key must not write there. */
export declare function leave(view: EditorView): void;
/** On Linux a middle press pastes on release, into the selection that is still where the caret was, focus or not; after a press the editor ignores, nothing is pasted into the editor until the release is over. A key other than a modifier, or the window losing focus, ends the hold early, so a paste made from the keyboard always goes in. */
export declare function holdsPaste(view: EditorView): void;
