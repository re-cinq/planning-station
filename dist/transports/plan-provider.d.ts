import { PlanMeta } from '@re-cinq/planning-document';
import { Awareness } from 'y-protocols/awareness';
import { Doc } from 'yjs';
import { PlanTransport } from '../session/plan-events.js';
/** What this transport needs of a provider; HocuspocusProvider has all of it. */
export interface PlanProvider {
    document: Doc;
    awareness: Awareness | null;
    synced: boolean;
    on(event: string, handler: (payload: never, origin: never) => void): void;
    destroy(): void;
}
export interface ProviderTransport extends PlanTransport {
    destroy(): void;
}
/** Marks what this transport wrote, so the provider's echo is not sent back. */
export declare const TRANSPORT_ORIGIN = "plan-transport";
export declare function transportFor(provider: PlanProvider, meta: PlanMeta): ProviderTransport;
