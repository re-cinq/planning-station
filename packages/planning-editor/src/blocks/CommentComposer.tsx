import { useState, type FormEvent, type KeyboardEvent } from "react";
import { actionsBlockId, newId } from "@re-cinq/planning-document";

import styles from "./CommentComposer.module.scss";
import { usePlanActions } from "./plan-actions.js";
import type { BlockInserter } from "./QuestionView.js";

export interface CommentComposerProps {
  block: { id: string; props: { slot: string; title: string } };
  editor: BlockInserter;
  onDone: () => void;
}

/** A one-line comment on a section, asked for from its heading. */
export function CommentComposer(props: CommentComposerProps) {
  const { draft, setDraft, say } = useComposer(props);
  const { title } = props.block.props;

  return (
    <form className={styles.composer} onSubmit={say}>
      <ComposerInput
        title={title}
        draft={draft}
        onDraft={setDraft}
        onLeave={props.onDone}
      />
      <button type="submit" className={styles.send}>
        Comment
      </button>
    </form>
  );
}

/** An empty draft says nothing and leaves the composer open. */
function useComposer({ block, editor, onDone }: CommentComposerProps) {
  const { user } = usePlanActions();
  const [draft, setDraft] = useState("");

  const say = (event: FormEvent) => {
    const said = draft.trim();
    event.preventDefault();

    if (said) {
      editor.insertBlocks(
        [commentBlock(said, user.name)],
        { id: actionsBlockId(block.props.slot) },
        "before",
      );
      onDone();
    }
  };

  return { draft, setDraft, say };
}

interface ComposerInputProps {
  title: string;
  draft: string;
  onDraft: (text: string) => void;
  onLeave: () => void;
}

function ComposerInput({ title, draft, onDraft, onLeave }: ComposerInputProps) {
  const leaveOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onLeave();
    }
  };

  return (
    <input
      className={styles.input}
      value={draft}
      aria-label={`Comment on ${title}`}
      placeholder="Add a comment"
      autoFocus
      onChange={(event) => onDraft(event.target.value)}
      onKeyDown={leaveOnEscape}
    />
  );
}

function commentBlock(text: string, author: string) {
  return {
    type: "comment",
    props: { commentId: newId("cmt"), author, at: new Date().toISOString() },
    content: text,
  };
}
