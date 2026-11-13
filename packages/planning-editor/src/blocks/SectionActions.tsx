import { useContext, useEffect, useId, useRef, useState } from "react";
import { isRemovableSlot } from "@re-cinq/planning-document";
import type { Doc } from "yjs";

import { removeSection } from "../session/remove-section.js";
import { TemplateContext, useSlot } from "../template/template-context.js";
import { GeneratePrototype } from "./GeneratePrototype.js";
import { usePlanActions } from "./plan-actions.js";
import { RefineControls } from "./RefineControls.js";
import styles from "./SectionActions.module.scss";

export interface SectionActionsProps {
  block: { props: Record<string, unknown> };
  editor: { isEditable: boolean };
}

interface SectionOf {
  doc: Doc;
  slot: string;
  title: string;
}

/** Closes each section, under its questions: ask the agent to work on it, or remove it. */
export function SectionActions({ block, editor }: SectionActionsProps) {
  const { slot, title } = useSectionOf(block);
  const { onRefine, doc } = usePlanActions();

  if (!doc || !editor.isEditable) {
    return null;
  }

  return (
    <div
      role="group"
      className={styles.actions}
      aria-label={`${title} actions`}
      contentEditable={false}
    >
      <GeneratePrototype doc={doc} slot={slot} />
      {onRefine && <RefineControls doc={doc} slot={slot} title={title} />}
      <RemoveSection doc={doc} slot={slot} title={title} />
    </div>
  );
}

/** Only a section the template does not always require can go, and only once the person confirms. */
function RemoveSection({ doc, slot, title }: SectionOf) {
  const template = useContext(TemplateContext);
  const [asking, setAsking] = useState(false);

  if (!template || !isRemovableSlot(template, slot)) {
    return null;
  }

  return (
    <>
      <RemoveButton title={title} onClick={() => setAsking(true)} />
      {asking && (
        <ConfirmRemove
          title={title}
          onConfirm={() => removeSection(doc, slot)}
          onCancel={() => setAsking(false)}
        />
      )}
    </>
  );
}

function RemoveButton({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.remove}
      aria-label={`Remove section ${title}`}
      onClick={onClick}
    >
      <TrashIcon />
    </button>
  );
}

interface ConfirmRemoveProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** A modal dialog, so the page behind it takes no press and Escape closes it without removing. */
function ConfirmRemove({ title, onConfirm, onCancel }: ConfirmRemoveProps) {
  const dialog = useModalRef();
  const headingId = useId();

  return (
    <dialog
      ref={dialog}
      className={styles.confirm}
      aria-labelledby={headingId}
      onClose={onCancel}
    >
      <h3 id={headingId} className={styles.question}>
        Remove {title}?
      </h3>
      <p className={styles.explanation}>
        Its content, comments and questions are deleted.
      </p>
      <RemoveChoices onConfirm={onConfirm} onCancel={onCancel} />
    </dialog>
  );
}

function useModalRef() {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => dialog.current?.showModal(), []);

  return dialog;
}

function RemoveChoices({
  onConfirm,
  onCancel,
}: Pick<ConfirmRemoveProps, "onConfirm" | "onCancel">) {
  return (
    <div className={styles.choices}>
      <button
        type="button"
        className={styles.cancel}
        autoFocus
        onClick={onCancel}
      >
        Cancel
      </button>
      <button type="button" className={styles.danger} onClick={onConfirm}>
        Remove
      </button>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
    </svg>
  );
}

function useSectionOf(block: SectionActionsProps["block"]) {
  const slot = String(block.props["slot"] ?? "");

  return { slot, title: useSlot(slot)?.title ?? slot };
}
