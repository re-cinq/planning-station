export interface AwarenessChange {
    added: number[];
    updated: number[];
    removed: number[];
}
export declare function changedClients(change: AwarenessChange): number[];
