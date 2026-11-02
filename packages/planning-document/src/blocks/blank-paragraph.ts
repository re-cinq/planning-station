import type { BlockJson } from "./block-json.js";
import { plainText } from "./inline-text.js";

/** A paragraph nobody has typed in yet, as a click on an empty section leaves one. It says nothing: a section's hash and the agent's read view both pass over it. planning-editor's empty-section placeholder reads a blank paragraph the same way. */
export function isBlankParagraph(block: BlockJson): boolean {
  return (
    block.type === "paragraph" &&
    block.children.length === 0 &&
    Array.isArray(block.content) &&
    plainText(block.content) === ""
  );
}
