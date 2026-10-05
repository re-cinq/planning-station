import { Plugin, PluginKey } from 'prosemirror-state';
import { Doc } from 'yjs';
import { ChangeHosts } from '../blocks/change-hosts.js';
export declare const CHANGE_WIDGETS: PluginKey<any>;
export type { ChangeHosts };
/** Draws an empty element after the paragraph each proposed change is about. ProseMirror owns the editor's DOM and strips anything put there by hand, so a change is a widget decoration — the one way to hang something between two blocks and have it stay. */
export declare function changeWidgets(doc: Doc, hosts: ChangeHosts): import('@blocknote/core').ExtensionFactoryInstance<{
    readonly key: "planChangeWidgets";
    readonly prosemirrorPlugins: readonly [Plugin<any>];
}>;
