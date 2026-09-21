import { useState, type FormEvent } from "react";
import { useBlockNoteEditor, useEditorChange } from "@blocknote/react";
import { newId } from "@re-cinq/planning-document";

import styles from "./CommentView.module.scss";
import { usePlanActions } from "./plan-actions.js";
import type { BlockUpdater } from "./PlanBlockView.js";
import type { BlockInserter } from "./QuestionView.js";

interface CommentBlock {
  id: string;
  type?: string;
  props: Record<string, unknown>;
}

export interface CommentViewProps {
  block: CommentBlock;
  editor: BlockInserter & BlockUpdater;
  contentRef?: (node: HTMLElement | null) => void;
}

type ThreadProps = Omit<CommentViewProps, "contentRef">;

interface ThreadState {
  isReply: boolean;
  resolved: boolean;
}

const RESOLVED = { props: { resolved: true } };
const REOPENED = { props: { resolved: false } };

/** A comment in the margin; the first of a thread carries its replies and whether it is resolved. */
export function CommentView({ block, editor, contentRef }: CommentViewProps) {
  const isReply = Boolean(block.props["replyTo"]);
  const resolved = useResolved(threadOf(block));

  return (
    <aside
      className={styles.comment}
      data-kind="comment"
      aria-label={`Comment by ${authorOf(block)}`}
      {...threadState({ isReply, resolved })}
    >
      <Byline block={block} resolved={resolved && !isReply} />
      <div className={styles.text} ref={contentRef} />
      {!isReply && editor.isEditable && (
        <ThreadActions block={block} editor={editor} resolved={resolved} />
      )}
    </aside>
  );
}

/** Resolving a thread's first comment folds its replies away. */
function threadState({ isReply, resolved }: ThreadState) {
  return {
    "data-reply": isReply || undefined,
    "data-resolved": resolved || undefined,
    hidden: isReply && resolved,
  };
}

function Byline({
  block,
  resolved,
}: {
  block: CommentBlock;
  resolved: boolean;
}) {
  return (
    <p className={styles.who} contentEditable={false}>
      <span className={styles.author}>{authorOf(block)}</span>
      <time className={styles.when}>{said(block.props["at"])}</time>
      {resolved && (
        <span className={styles.badge}>
          {block.props["used"] === true ? "In the plan" : "Resolved"}
        </span>
      )}
    </p>
  );
}

function ThreadActions({
  block,
  editor,
  resolved,
}: ThreadProps & { resolved: boolean }) {
  return (
    <div className={styles.actions} contentEditable={false}>
      {resolved ? (
        <TextButton
          label="Reopen"
          onClick={() => editor.updateBlock(block, REOPENED)}
        />
      ) : (
        <OpenThread block={block} editor={editor} />
      )}
    </div>
  );
}

function OpenThread({ block, editor }: ThreadProps) {
  const [replying, setReplying] = useState(false);

  return (
    <>
      {replying ? (
        <ReplyBox
          block={block}
          editor={editor}
          onDone={() => setReplying(false)}
        />
      ) : (
        <TextButton label="Reply" onClick={() => setReplying(true)} />
      )}
      <TextButton
        label="Resolve"
        onClick={() => editor.updateBlock(block, RESOLVED)}
      />
    </>
  );
}

function TextButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
}

function ReplyBox({
  block,
  editor,
  onDone,
}: ThreadProps & { onDone: () => void }) {
  const [draft, setDraft] = useState("");
  const post = usePostReply({ editor, block });

  const reply = (event: FormEvent) => {
    event.preventDefault();
    post(draft.trim());
    onDone();
  };

  return (
    <form className={styles.reply} onSubmit={reply}>
      <ReplyInput to={authorOf(block)} draft={draft} onDraft={setDraft} />
    </form>
  );
}

interface ReplyInputProps {
  to: string;
  draft: string;
  onDraft: (text: string) => void;
}

function ReplyInput({ to, draft, onDraft }: ReplyInputProps) {
  return (
    <input
      className={styles.input}
      value={draft}
      aria-label={`Reply to ${to}`}
      placeholder="Reply"
      autoFocus
      onChange={(event) => onDraft(event.target.value)}
    />
  );
}

/** A reply goes last in its thread, so the thread reads in order. */
function usePostReply({ editor, block }: ThreadProps): (text: string) => void {
  const { user } = usePlanActions();
  const blockNote = useBlockNoteEditor();

  return (text) => {
    if (!text) {
      return;
    }

    const thread = threadOf(block);
    const blocks = blockNote.document as CommentBlock[];
    const last = lastOfThread(blocks, thread) ?? block;
    editor.insertBlocks([replyBlock(thread, text, user.name)], last, "after");
  };
}

function useResolved(thread: string): boolean {
  const editor = useBlockNoteEditor();
  const read = () => isResolved(editor.document as CommentBlock[], thread);
  const [resolved, setResolved] = useState(read);
  useEditorChange(() => setResolved(read()));

  return resolved;
}

function isResolved(blocks: readonly CommentBlock[], thread: string): boolean {
  return blocks.some(
    (block) =>
      opensThread(block) &&
      threadOf(block) === thread &&
      block.props["resolved"] === true,
  );
}

function lastOfThread(
  blocks: readonly CommentBlock[],
  thread: string,
): CommentBlock | undefined {
  return blocks
    .filter((block) => block.type === "comment" && threadOf(block) === thread)
    .at(-1);
}

function opensThread(block: CommentBlock): boolean {
  return block.type === "comment" && !block.props["replyTo"];
}

function threadOf(block: CommentBlock): string {
  return String(block.props["replyTo"] || block.props["commentId"] || block.id);
}

function authorOf(block: CommentBlock): string {
  return String(block.props["author"] || "Someone");
}

function replyBlock(thread: string, text: string, author: string) {
  const at = new Date().toISOString();

  return {
    type: "comment",
    props: { commentId: newId("cmt"), replyTo: thread, author, at },
    content: text,
  };
}

function said(at: unknown): string {
  const when = new Date(String(at));

  return Number.isNaN(when.getTime()) ? "" : when.toLocaleString();
}
