export interface AwarenessChange {
  added: number[];
  updated: number[];
  removed: number[];
}

export function changedClients(change: AwarenessChange): number[] {
  return [...change.added, ...change.updated, ...change.removed];
}
