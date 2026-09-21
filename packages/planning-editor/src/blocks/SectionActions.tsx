import { useSlot } from "../template/template-context.js";
import { usePlanActions } from "./plan-actions.js";
import { RefineControls } from "./RefineControls.js";
import styles from "./SectionActions.module.scss";

export interface SectionActionsProps {
  block: { props: Record<string, unknown> };
  editor: { isEditable: boolean };
}

/** Closes each section, under its questions: ask the agent to work on it. */
export function SectionActions({ block, editor }: SectionActionsProps) {
  const { slot, title } = useSectionOf(block);
  const { onRefine, doc } = usePlanActions();

  if (!onRefine || !doc || !editor.isEditable) {
    return null;
  }

  return (
    <div
      role="group"
      className={styles.actions}
      aria-label={`${title} actions`}
      contentEditable={false}
    >
      <RefineControls doc={doc} slot={slot} title={title} />
    </div>
  );
}

function useSectionOf(block: SectionActionsProps["block"]) {
  const slot = String(block.props["slot"] ?? "");

  return { slot, title: useSlot(slot)?.title ?? slot };
}
