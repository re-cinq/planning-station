import styles from "./PlanTitleView.module.scss";

export interface PlanTitleViewProps {
  contentRef?: (node: HTMLElement | null) => void;
}

/** The feature's name, as the plan's only level 1 heading. */
export function PlanTitleView({ contentRef }: PlanTitleViewProps) {
  return (
    <h1
      className={styles.title}
      ref={contentRef}
      data-placeholder="Name this feature"
    />
  );
}
