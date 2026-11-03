import { ExtensionOptions } from '@blocknote/core';
import { Node } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
export declare const EMPTY_SECTION_TEXT = "Write here\u2026";
type Editor = ExtensionOptions["editor"];
type Write = (beforeId: string) => void;
export declare function placeholders(doc: Node, write: Write): Decoration[];
/** Puts a paragraph where the section's writing starts and the cursor in it. */
export declare function writeBefore(editor: Editor, beforeId: string): void;
export {};
