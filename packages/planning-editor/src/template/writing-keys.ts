import { IS_APPLE } from "./platform.js";

/** Keys that write or delete, besides a typed character. */
const EDITING_KEYS: readonly string[] = ["Enter", "Backspace", "Delete"];

/** Control's chords that delete, transpose or open a line in text on Apple's systems; its others only move the caret. */
const APPLE_CONTROL_EDITS: readonly string[] = ["d", "h", "k", "o", "t"];

/** A key that writes or deletes where the caret is, rather than a shortcut. */
export function writes(event: KeyboardEvent): boolean {
  const { key, metaKey } = event;
  const typed = EDITING_KEYS.includes(key) || [...key].length === 1;

  return typed && !metaKey && !isControlShortcut(event);
}

/** A Control chord is a shortcut, except where it writes: AltGr, which sends Control with a character, and Control's editing keys on Apple's systems. */
function isControlShortcut(event: KeyboardEvent): boolean {
  const edits = IS_APPLE && APPLE_CONTROL_EDITS.includes(event.key);

  return event.ctrlKey && !edits && !event.getModifierState("AltGraph");
}
