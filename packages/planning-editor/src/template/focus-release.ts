import type { EditorView } from "prosemirror-view";

const CAPTURE = { capture: true };
const CAPTURE_ONCE = { ...CAPTURE, once: true };

/** A press the editor ignores still moves the person's attention away from where the caret was, so the editor lets go of focus: the next key must not write there. */
export function leave(view: EditorView): void {
  const { dom } = view;

  if (dom instanceof HTMLElement) {
    dom.blur();
  }
}

/** Lets go of focus once the press under way is released, for a press whose own default focuses the editor again. */
export function leaveOnRelease(view: EditorView): void {
  const { ownerDocument } = view.dom;

  ownerDocument.addEventListener("pointerup", () => leave(view), CAPTURE_ONCE);
}

/** On Linux a middle press pastes on release, into the selection that is still where the caret was, focus or not; after a press the editor ignores, nothing is pasted until the release is over. */
export function holdsPaste(view: EditorView): void {
  const { ownerDocument } = view.dom;

  const cancel = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const release = (event: Event) => {
    event.preventDefault();
    setTimeout(() => {
      ownerDocument.removeEventListener("paste", cancel, CAPTURE);
    });
  };

  ownerDocument.addEventListener("paste", cancel, CAPTURE);
  ownerDocument.addEventListener("mouseup", release, CAPTURE_ONCE);
}
