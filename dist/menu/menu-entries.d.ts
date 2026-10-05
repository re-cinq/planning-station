import { BlockKind } from '@re-cinq/planning-document';
import { MenuBlock } from './section-context.js';
export interface InsertContext {
    blocks: readonly MenuBlock[];
    cursorId: string;
}
type Props = Record<string, unknown>;
export interface MenuEntry {
    kind: BlockKind;
    title: string;
    group: string;
    aliases?: readonly string[];
    props?: (context: InsertContext) => Props | null;
    content?: unknown;
}
export declare const MENU_ENTRIES: readonly MenuEntry[];
export {};
