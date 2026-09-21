import { Node } from 'prosemirror-model';
import { Plugin, EditorState, Transaction } from 'prosemirror-state';
export declare const templateGuard: import('@blocknote/core').ExtensionFactoryInstance<{
    readonly key: "planTemplateGuard";
    readonly prosemirrorPlugins: readonly [Plugin<any>];
}>;
export declare function bypassTemplate(transaction: Transaction, reason: string): Transaction;
export declare function keepsSectionHeadings(transaction: Transaction, state: EditorState): boolean;
export declare function headingSlots(doc: Node): string[];
