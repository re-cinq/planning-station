import { DefaultReactSuggestionItem } from '@blocknote/react';
import { PlanTemplate } from '@re-cinq/planning-document';
import { PlanBlockNoteEditor } from '../schema/block-bridge.js';
export declare function PlanSlashMenu(): import("react").JSX.Element;
export declare function itemsAtCursor(editor: PlanBlockNoteEditor, template: PlanTemplate | null): DefaultReactSuggestionItem[];
