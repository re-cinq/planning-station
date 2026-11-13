import { useContext } from "react";

import { AdaptersContext, type Mockup } from "./adapters.js";
import styles from "./PlanBlockView.module.scss";

export interface MockupViewProps {
  block: { props: Mockup };
}

export function MockupView({ block }: MockupViewProps) {
  const { renderMockup } = useContext(AdaptersContext);

  return (
    <figure className={styles.block} data-kind="mockup" contentEditable={false}>
      <MockupCaption mockup={block.props} />
      {renderMockup ? (
        renderMockup(block.props)
      ) : (
        <p>The host renders mockups; none is configured.</p>
      )}
    </figure>
  );
}

function MockupCaption({ mockup }: { mockup: Mockup }) {
  return (
    <figcaption className={styles.label}>
      {mockup.caption || "Sketch"}
      {mockup.kind && <span className={styles.kind}>{mockup.kind}</span>}
    </figcaption>
  );
}
