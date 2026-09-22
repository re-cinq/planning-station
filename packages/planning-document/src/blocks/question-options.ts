import { parseJson } from "../lib/parse-json.js";

// A BlockNote prop holds a primitive, so the options travel as JSON: joined by commas, an option carrying its own comma was read back as two.

/** The options as one prop value. */
export function encodeOptions(options: readonly string[]): string {
  return options.length > 0 ? JSON.stringify(options) : "";
}

/** The options a prop holds, JSON or, for a plan written before this, comma-separated. */
export function optionsOf(prop: unknown): string[] {
  const raw = String(prop ?? "").trim();
  const parsed = raw.startsWith("[") ? parseJson(raw) : undefined;

  return Array.isArray(parsed)
    ? parsed.map(String).filter(Boolean)
    : split(raw);
}

function split(raw: string): string[] {
  return raw
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean);
}
