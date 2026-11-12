import { SectionSlot } from '@re-cinq/planning-document';
import { InsertContext } from './menu-entries.js';
export interface ResolvedEntry {
    title: string;
    group: string;
    aliases: readonly string[];
    block: {
        type: string;
        props: Record<string, unknown>;
        content?: unknown;
    };
}
export declare function menuEntries(slot: SectionSlot, context: InsertContext): ResolvedEntry[];
