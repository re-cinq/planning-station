import styles from "./FindingView.module.scss";
import type { BlockUpdater } from "./PlanBlockView.js";

interface FindingBlock {
  id: string;
  props: Record<string, unknown>;
}

export interface FindingViewProps {
  block: FindingBlock;
  editor: BlockUpdater;
  contentRef?: (node: HTMLElement | null) => void;
}

/** A finding raised on the plan; resolving it folds its severity marker to muted. */
export function FindingView({ block, editor, contentRef }: FindingViewProps) {
  const severity = String(block.props["severity"] ?? "");
  const resolved = block.props["resolved"] === true;

  return (
    <div
      className={styles.finding}
      data-severity={severity}
      data-resolved={resolved}
      aria-label={`Finding · ${severity}`}
    >
      <div className={styles.text} ref={contentRef} />
      <p className={styles.why}>{String(block.props["why"] ?? "")}</p>
      {editor.isEditable && (
        <button
          type="button"
          onClick={() =>
            editor.updateBlock(block, { props: { resolved: !resolved } })
          }
        >
          {resolved ? "Reopen" : "Resolve"}
        </button>
      )}
    </div>
  );
}
