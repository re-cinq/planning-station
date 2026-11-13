import { useState } from "react";

import { useSlot } from "../template/template-context.js";
import { CommentComposer } from "./CommentComposer.js";
import type { BlockInserter } from "./QuestionView.js";
import styles from "./SectionHeading.module.scss";

export interface SectionHeadingProps {
  block: { id: string; props: { slot: string; title: string } };
  editor: BlockInserter;
}

export function SectionHeading({ block, editor }: SectionHeadingProps) {
  const [composing, setComposing] = useState(false);
  const { slot, title } = block.props;
  const close = () => setComposing(false);

  return (
    <header className={styles.heading} data-slot={slot} contentEditable={false}>
      <TitleRow
        title={title}
        commentable={editor.isEditable}
        open={composing}
        onToggle={() => setComposing(!composing)}
      />
      <SlotHint slot={slot} />
      {composing && (
        <CommentComposer block={block} editor={editor} onDone={close} />
      )}
    </header>
  );
}

function SlotHint({ slot }: { slot: string }) {
  const hint = useSlot(slot)?.hint;

  return hint && <p className={styles.hint}>{hint}</p>;
}

interface TitleRowProps {
  title: string;
  commentable: boolean;
  open: boolean;
  onToggle: () => void;
}

function TitleRow({ title, commentable, open, onToggle }: TitleRowProps) {
  return (
    <div className={styles.row}>
      <h2 className={styles.title}>{title}</h2>
      {commentable && (
        <CommentToggle title={title} open={open} onToggle={onToggle} />
      )}
    </div>
  );
}

type CommentToggleProps = Pick<TitleRowProps, "title" | "open" | "onToggle">;

/** Pressing it must not blur the editor: a blur clears this tab's cursor for everyone else. */
function CommentToggle({ title, open, onToggle }: CommentToggleProps) {
  return (
    <button
      type="button"
      className={styles.comment}
      aria-expanded={open}
      aria-label={`${open ? "Close comment" : "Comment"} on ${title}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onToggle}
    >
      <CommentIcon />
      Comment
    </button>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
