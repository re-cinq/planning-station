import { useState, type FormEvent } from "react";
import { newId } from "@re-cinq/planning-document";

import { useSlot } from "../template/template-context.js";
import { usePlanActions } from "./plan-actions.js";
import type { BlockInserter } from "./QuestionView.js";
import styles from "./SectionPanel.module.scss";

export interface SectionPanelProps {
  block: { id: string; props: Record<string, unknown> };
  editor: BlockInserter;
}

/** Each section's margin: say something about it. */
export function SectionPanel({ block, editor }: SectionPanelProps) {
  const slot = String(block.props["slot"] ?? "");
  const title = useSlot(slot)?.title ?? slot;

  if (!editor.isEditable) {
    return null;
  }

  return (
    <aside
      className={styles.panel}
      data-slot={slot}
      aria-label={`${title} tools`}
      contentEditable={false}
    >
      <CommentBox block={block} editor={editor} title={title} />
    </aside>
  );
}

function CommentBox({ block, editor, title }: SectionPanelProps & Named) {
  const { user } = usePlanActions();
  const [draft, setDraft] = useState("");

  const say = (event: FormEvent) => {
    event.preventDefault();
    setDraft(sayIt({ block, editor }, draft.trim(), user.name));
  };

  return (
    <form className={styles.commentBox} onSubmit={say}>
      <input
        className={styles.input}
        value={draft}
        aria-label={`Comment on ${title}`}
        placeholder="Add a comment"
        onChange={(event) => setDraft(event.target.value)}
      />
      <SendButton />
    </form>
  );
}

function SendButton() {
  return (
    <button type="submit" className={styles.send}>
      Comment
    </button>
  );
}

interface Named {
  title: string;
}

/** Answers the draft the box should hold next: nothing, once it is said. */
function sayIt(
  { block, editor }: SectionPanelProps,
  said: string,
  author: string,
): string {
  if (!said) {
    return said;
  }

  editor.insertBlocks([comment(said, author)], block, "before");

  return "";
}

function comment(text: string, author: string) {
  return {
    type: "comment",
    props: { commentId: newId("cmt"), author, at: new Date().toISOString() },
    content: text,
  };
}
