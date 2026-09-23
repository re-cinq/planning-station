import { PlanMeta } from '@re-cinq/planning-document';
import { ProviderTransport } from './plan-provider.js';
export interface HocuspocusTransportOptions {
    /** The collaboration endpoint, for example wss://api.example/api/plans/collab. */
    url: string;
    /** The plan's document name: plan:owner/repo:uuid. */
    name: string;
    /** The plan meta the host already fetched; it travels in the document event. */
    meta: PlanMeta;
    token?: string | (() => Promise<string>);
}
/** The reference transport: one HocuspocusProvider behind a PlanTransport. */
export declare function createHocuspocusTransport(options: HocuspocusTransportOptions): ProviderTransport;
