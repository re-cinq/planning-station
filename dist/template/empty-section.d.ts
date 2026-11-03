import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export { EMPTY_SECTION_TEXT } from './placeholders.js';
/** Gives a section nobody has written in a place to click, and keeps the editor's padding and skeleton from taking the cursor. */
export declare const emptySectionPlaceholder: import('@blocknote/core').ExtensionFactoryInstance<{
    key: string;
    prosemirrorPlugins: Plugin<any>[];
}>;
/** A paste after selecting text in a section's panel or actions has nowhere it belongs either: ProseMirror would put it where the caret was. A paste into the panel's own input is the input's. */
export declare function ignoresPasteOnSkeleton(view: EditorView, event: ClipboardEvent): boolean;
/** Text in a section's panel or actions can be selected to copy it, which leaves the editor focused with its caret where it was, or selects the block itself. A key that writes or deletes then has nowhere it belongs, so it does nothing, rather than act on that caret or put a paragraph beside the block. Keys typed into the panel's own input are the input's. */
export declare function ignoresKeysOnSkeleton(view: EditorView, event: KeyboardEvent): boolean;
/** A press beside the blocks, level only with a section's skeleton, neither focuses the editor nor selects a block; level with a line of text, or in a gap, it still puts the caret where the editor would. */
export declare function ignoresBesideBlocks(view: EditorView, event: MouseEvent): boolean;
/** A press on a section's heading, panel or actions, away from their buttons, inputs and selectable text, takes nothing either: the editor has no place to put the caret there. A press on selectable text still starts a selection, so it can be copied. */
export declare function ignoresSkeletonSpace(view: EditorView, event: MouseEvent): boolean;
