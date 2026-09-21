export function newId(prefix: string): string {
  return `${prefix}_${globalThis.crypto.randomUUID()}`;
}
