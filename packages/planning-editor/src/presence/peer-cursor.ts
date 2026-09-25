import type { PresenceUser } from "./presence-users.js";

interface CursorOwner {
  id?: string;
  name: string;
  color: string;
}

const WORD_JOINER = "⁠";

// BlockNote builds a caret once per client and reuses it, so the color comes from a variable the editor keeps current.
export function peerCursor(user: CursorOwner): HTMLElement {
  const paint = `background-color: var(${peerVariable(user.id ?? "")}, ${user.color}); color: white`;
  const label = element("bn-collaboration-cursor__label", paint);
  label.append(user.name);
  const caret = element("bn-collaboration-cursor__caret", paint);
  caret.setAttribute("contenteditable", "false");
  caret.append(label);
  const cursor = element("bn-collaboration-cursor__base");
  cursor.append(WORD_JOINER, caret, WORD_JOINER);

  return cursor;
}

/** Sets each peer's current color as the variable its caret reads. */
export function paintPeers(
  root: HTMLElement,
  users: readonly PresenceUser[],
): void {
  users.forEach((user) =>
    root.style.setProperty(peerVariable(user.id), user.color),
  );
}

function peerVariable(id: string): string {
  return `--ps-peer-${[...id].map(cssSafe).join("")}`;
}

function cssSafe(char: string): string {
  return /[\w-]/.test(char) ? char : `_${char.charCodeAt(0)}`;
}

function element(className: string, style?: string): HTMLElement {
  const span = document.createElement("span");
  span.classList.add(className);

  if (style) {
    span.setAttribute("style", style);
  }

  return span;
}
