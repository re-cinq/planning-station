import type { ReactNode } from "react";
import type { Mockup } from "@re-cinq/planning-editor";

import styles from "./App.module.scss";

type Frame = (mockup: Mockup) => ReactNode;

/** A plain stand-in for a host's renderer: html in a frame that runs nothing, svg as an image, mermaid and text as their source. */
export function SketchFrame(mockup: Mockup) {
  const frame = FRAMES[mockup.format] ?? SourceFrame;

  return frame(mockup);
}

function HtmlFrame({ markup, height, caption }: Mockup) {
  return (
    <iframe
      className={styles.sketch}
      sandbox=""
      srcDoc={markup}
      title={caption}
      height={height}
    />
  );
}

function SvgFrame({ markup, height, caption }: Mockup) {
  return (
    <img
      className={styles.sketch}
      src={`data:image/svg+xml;utf8,${encodeURIComponent(markup)}`}
      alt={caption}
      height={height}
    />
  );
}

function SourceFrame({ markup }: Mockup) {
  return <pre className={styles.source}>{markup}</pre>;
}

const FRAMES: Partial<Record<string, Frame>> = {
  html: HtmlFrame,
  svg: SvgFrame,
};
