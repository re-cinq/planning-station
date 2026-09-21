import { parseBlock, type BlockJson } from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";

export interface BlockBody {
  text?: string;
  id?: string;
}

let lastId = 0;

export function block(
  type: string,
  props: Record<string, unknown> = {},
  body: BlockBody = {},
): BlockJson {
  const { text = "", id = nextId() } = body;

  return parseBlock({ id, type, props, content: inlineFromText(text) });
}

export function heading(
  slot: string,
  title: string,
  id = `h-${slot}`,
): BlockJson {
  return block("section-heading", { slot, title }, { id });
}

export function paragraph(text: string, id?: string): BlockJson {
  return block("paragraph", {}, { text, id });
}

function nextId(): string {
  lastId += 1;

  return `b${lastId}`;
}
