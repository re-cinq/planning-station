import { useSlot } from "../template/template-context.js";
import styles from "./SectionHeading.module.scss";

export interface SectionHeadingProps {
  block: { props: { slot: string; title: string } };
}

export function SectionHeading({ block }: SectionHeadingProps) {
  const slot = useSlot(block.props.slot);

  return (
    <header
      className={styles.heading}
      data-slot={block.props.slot}
      contentEditable={false}
    >
      <h2 className={styles.title}>{block.props.title}</h2>
      {slot && <p className={styles.hint}>{slot.hint}</p>}
    </header>
  );
}
