import type { EditorView } from "prosemirror-view";

/** How long after a released tap the browser may still focus the editor: a tap's focus comes after its release. */
const TAP_FOCUS_MS = 500;

/** A press the editor ignores still moves the person's attention away from where the caret was, so the editor lets go of focus: the next key must not write there. */
export function leave(view: EditorView): void {
  const { dom } = view;

  if (dom instanceof HTMLElement) {
    dom.blur();
  }
}

/** Lets go of focus once the press under way is released, for a press whose own default focuses the editor again; a press that is cancelled, as a touch turned into a scroll is, leaves the editor be. */
export function leaveOnRelease(view: EditorView, press: PointerEvent): void {
  const { ownerDocument } = view.dom;
  const done = new AbortController();
  const options = { capture: true, signal: done.signal };

  const end = (event: PointerEvent) => {
    if (event.pointerId !== press.pointerId) {
      return;
    }

    done.abort();

    if (event.type === "pointerup") {
      refusesFocus(view);
    }
  };

  ownerDocument.addEventListener("pointerup", end, options);
  ownerDocument.addEventListener("pointercancel", end, options);
}

/** Blurs the editor now, and again should the released tap focus it, until the next press or a moment has passed. */
function refusesFocus(view: EditorView): void {
  const { dom } = view;
  const done = new AbortController();
  const { signal } = done;

  leave(view);
  dom.addEventListener("focusin", () => leave(view), { signal });
  dom.ownerDocument.addEventListener("pointerdown", () => done.abort(), {
    capture: true,
    signal,
  });
  setTimeout(() => done.abort(), TAP_FOCUS_MS);
}

/** On Linux a middle press pastes on release, into the selection that is still where the caret was, focus or not; after a press the editor ignores, nothing is pasted into the editor until the release is over. A key, or the window losing focus, ends the hold early, so a paste made from the keyboard always goes in. */
export function holdsPaste(view: EditorView): void {
  const { dom } = view;
  const { ownerDocument } = dom;
  const done = new AbortController();
  const { signal } = done;
  const options = { capture: true, signal };
  const end = () => setTimeout(() => done.abort());

  const cancel = (event: Event) => {
    if (event.target instanceof Node && dom.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  ownerDocument.addEventListener("paste", cancel, options);
  ownerDocument.addEventListener("pointerup", end, options);
  ownerDocument.addEventListener("keydown", () => done.abort(), options);
  ownerDocument.defaultView?.addEventListener("blur", () => done.abort(), {
    signal,
  });
}
