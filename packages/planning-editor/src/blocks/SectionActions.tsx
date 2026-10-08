import { useContext, useState } from "react";
import { isRemovableSlot } from "@re-cinq/planning-document";
import type { Doc } from "yjs";

import { removeSection } from "../session/remove-section.js";
import { TemplateContext, useSlot } from "../template/template-context.js";
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

function ConfirmRemove({ title, onConfirm, onCancel }: ConfirmRemoveProps) {
  const question = `Remove ${title}?`;

  return (
    <div className={styles.confirm} role="dialog" aria-label={question}>
      <p className={styles.question}>
        {question} Its content, comments and questions are deleted.
      </p>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" onClick={onConfirm}>
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
