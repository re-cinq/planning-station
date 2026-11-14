import { Plugin, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
/** Moving a block with Mod-Shift-Arrow past a section's edge carries it over the section's actions, so it never lands under Refine. */
export declare const sectionMoves: import('@blocknote/core').ExtensionFactoryInstance<{
    readonly key: "planSectionMoves";
    readonly prosemirrorPlugins: readonly [Plugin<any>];
}>;
export declare function movesAcrossSections(view: EditorView, event: KeyboardEvent): boolean;
export declare function isTopLevel(selection: Selection): boolean;
