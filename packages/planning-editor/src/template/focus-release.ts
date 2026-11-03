import type { EditorView } from "prosemirror-view";

/** Keys held on their way to a shortcut: pressing one is not yet a paste from the keyboard. */
const MODIFIERS: readonly string[] = [
  "Shift",
  "Control",
  "Alt",
  "AltGraph",
  "Meta",
  "CapsLock",
];

/** A press the editor ignores still moves the person's attention away from where the caret was, so the editor lets go of focus: the next key must not write there. */
export function leave(view: EditorView): void {
  const { dom } = view;

  if (dom instanceof HTMLElement) {
    dom.blur();
  }
}

/** On Linux a middle press pastes on release, into the selection that is still where the caret was, focus or not; after a press the editor ignores, nothing is pasted into the editor until the release is over. A key other than a modifier, or the window losing focus, ends the hold early, so a paste made from the keyboard always goes in. */
export function holdsPaste(view: EditorView): void {
  const { dom } = view;
  const done = new AbortController();
  const { signal } = done;
  const options = { capture: true, signal };
  const { ownerDocument } = dom;

  ownerDocument.addEventListener("paste", cancelsPasteIn(dom), options);
  ownerDocument.addEventListener(
    "pointerup",
    () => {
      setTimeout(() => done.abort());
    },
    options,
  );
  ownerDocument.addEventListener("keydown", endsOnKey(done), options);
  ownerDocument.defaultView?.addEventListener("blur", () => done.abort(), {
    signal,
  });
}

function cancelsPasteIn(dom: Element) {
  return (event: Event) => {
    if (event.target instanceof Node && dom.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
}

function endsOnKey(done: AbortController) {
  return ({ key }: KeyboardEvent) => {
    if (!MODIFIERS.includes(key)) {
      done.abort();
    }
  };
}
