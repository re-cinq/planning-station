import { useState, type FormEvent } from "react";
import { useBlockNoteEditor, useEditorChange } from "@blocknote/react";

import styles from "./QuestionView.module.scss";

export interface BlockInserter {
  isEditable: boolean;
  insertBlocks(
    blocks: readonly unknown[],
    reference: { id: string },
    placement: "before" | "after",
  ): unknown;
}

export interface QuestionViewProps {
  block: { id: string; props: Record<string, unknown> };
  editor: BlockInserter;
  contentRef?: (node: HTMLElement | null) => void;
}

type AnswerProps = Omit<QuestionViewProps, "contentRef">;

/** What the agent asked, answered by picking a suggestion or by writing one. */
export function QuestionView({ block, editor, contentRef }: QuestionViewProps) {
  const options = suggestionsOf(block.props["options"]);

  return (
    <div className={styles.question} data-kind="question">
      <Asked
        why={String(block.props["why"] ?? "")}
        picks={options.length > 0}
        used={block.props["used"] === true}
      />
      <div
        className={styles.text}
        ref={contentRef}
        data-placeholder="What the plan still has to decide"
      />
      <Responses block={block} editor={editor} options={options} />
    </div>
  );
}

interface AskedProps {
  why: string;
  picks: boolean;
  used: boolean;
}

/** Why the agent asks, and whether it wants a pick or a written answer; once a refine used it, only that. */
function Asked({ why, picks, used }: AskedProps) {
  if (used) {
    return (
      <p className={styles.asked} contentEditable={false}>
        <span className={styles.label}>Question · in the plan</span>
      </p>
    );
  }

  return (
    <p className={styles.asked} contentEditable={false}>
      <span className={styles.label}>Question</span>
      {why && <span className={styles.why}>{why}</span>}
      <span className={styles.how}>
        {picks ? "Pick one" : "Write the answer"}
      </span>
    </p>
  );
}

function Responses({
  block,
  editor,
  options,
}: AnswerProps & { options: string[] }) {
  const answered = useAnswered(questionIdOf(block));

  if (answered || !editor.isEditable) {
    return null;
  }

  return options.length > 0 ? (
    <Suggestions block={block} editor={editor} options={options} />
  ) : (
    <AnswerBox block={block} editor={editor} />
  );
}

function Suggestions({
  block,
  editor,
  options,
}: AnswerProps & { options: string[] }) {
  return (
    <ul className={styles.suggestions} contentEditable={false}>
      {options.map((option) => (
        <li key={option}>
          <Suggestion onPick={() => answer(editor, block, option)}>
            {option}
          </Suggestion>
        </li>
      ))}
    </ul>
  );
}

function Suggestion({
  onPick,
  children,
}: {
  onPick: () => void;
  children: string;
}) {
  return (
    <button type="button" className={styles.suggestion} onClick={onPick}>
      {children}
    </button>
  );
}

function AnswerBox({ block, editor }: AnswerProps) {
  const [draft, setDraft] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    answer(editor, block, draft.trim());
  };

  return (
    <form
      className={styles.answerBox}
      onSubmit={submit}
      contentEditable={false}
    >
      <AnswerInput draft={draft} onDraft={setDraft} />
      <button type="submit" className={styles.answerButton}>
        Answer
      </button>
    </form>
  );
}

function AnswerInput({
  draft,
  onDraft,
}: {
  draft: string;
  onDraft: (text: string) => void;
}) {
  return (
    <input
      className={styles.answerInput}
      value={draft}
      aria-label="Your answer"
      placeholder="Type your answer"
      onChange={(event) => onDraft(event.target.value)}
    />
  );
}

function suggestionsOf(options: unknown): string[] {
  return String(options ?? "")
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean);
}

/** The answer goes right under the question it answers; an empty one is no answer. */
function answer(
  editor: BlockInserter,
  block: AnswerProps["block"],
  text: string,
): void {
  if (!text) {
    return;
  }

  const questionId = questionIdOf(block);
  editor.insertBlocks(
    [{ type: "answer", props: { questionId }, content: text }],
    block,
    "after",
  );
}

/** Once someone has answered, the ways to answer have done their job. */
function useAnswered(questionId: string): boolean {
  const editor = useBlockNoteEditor();
  const [answered, setAnswered] = useState(() =>
    hasAnswer(editor.document, questionId),
  );
  useEditorChange(() => setAnswered(hasAnswer(editor.document, questionId)));

  return answered;
}

function hasAnswer(blocks: readonly unknown[], questionId: string): boolean {
  return (blocks as readonly AnyBlock[]).some(
    (block) =>
      block.type === "answer" && block.props["questionId"] === questionId,
  );
}

interface AnyBlock {
  type: string;
  props: Record<string, unknown>;
}

function questionIdOf(block: AnswerProps["block"]): string {
  return String(block.props["questionId"] || block.id);
}
