// JSON.parse is the one way to read JSON, and it throws on text that is not.
export function parseJson(body: string): unknown {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return undefined;
  }
}
