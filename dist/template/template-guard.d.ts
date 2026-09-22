import { Node } from 'prosemirror-model';
import { Plugin, EditorState, Transaction } from 'prosemirror-state';
/** The plan's skeleton: its title, its section headings and each section's panel and actions. */
export declare const STRUCTURAL: readonly string[];
export declare const templateGuard: import('@blocknote/core').ExtensionFactoryInstance<{
    readonly key: "planTemplateGuard";
    readonly prosemirrorPlugins: readonly [Plugin<any>];
}>;
export declare function bypassTemplate(transaction: Transaction, reason: string): Transaction;
export declare function keepsSectionHeadings(transaction: Transaction, state: EditorState): boolean;
export declare function headingSlots(doc: Node): string[];
