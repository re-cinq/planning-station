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

type ToggleProps = Omit<FindingViewProps, "contentRef"> & { resolved: boolean };

/** A finding raised on the plan; once resolved it folds to one muted line. */
export function FindingView({ block, editor, contentRef }: FindingViewProps) {
  const severity = String(block.props["severity"] ?? "");
  const resolved = block.props["resolved"] === true;

  return (
    <aside
      className={styles.finding}
      data-kind="finding"
      data-severity={severity}
      data-resolved={resolved || undefined}
      aria-label={labelOf(severity)}
    >
      <Byline severity={severity} why={String(block.props["why"] ?? "")} />
      <div className={styles.text} ref={contentRef} />
      {editor.isEditable && (
        <ResolveToggle block={block} editor={editor} resolved={resolved} />
      )}
    </aside>
  );
}

function Byline({ severity, why }: { severity: string; why: string }) {
  return (
    <p className={styles.who} contentEditable={false}>
      <span className={styles.label}>{labelOf(severity)}</span>
      {why && <span className={styles.why}>{why}</span>}
    </p>
  );
}

function ResolveToggle({ block, editor, resolved }: ToggleProps) {
  const toggle = () =>
    editor.updateBlock(block, { props: { resolved: !resolved } });

  return (
    <div className={styles.actions} contentEditable={false}>
      <button type="button" onClick={toggle}>
        {resolved ? "Reopen" : "Resolve"}
      </button>
    </div>
  );
}

function labelOf(severity: string): string {
  return `Finding · ${severity}`;
}
