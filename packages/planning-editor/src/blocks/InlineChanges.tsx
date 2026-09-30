import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { changeWords, type PlanChange } from "@re-cinq/planning-document";

import type { ChangeHosts } from "./change-hosts.js";
import type { ReviewableChange } from "../session/use-plan-changes.js";
import styles from "./InlineChanges.module.scss";
import refine from "./RefineControls.module.scss";

export interface InlineChangesProps {
  changes: readonly ReviewableChange[];
  /** The element the widget decoration keeps after each anchored paragraph; the card is drawn into it. */
  hosts: ChangeHosts;
}

/** Every proposed change, drawn under the paragraph it is about: a person reads the agent's new words where the old ones stand, and takes or leaves that one paragraph. */
export function InlineChanges({ changes, hosts }: InlineChangesProps) {
  return (
    <>
      {changes.map((review) => (
        <HostedChange
          key={review.change.changeId}
          review={review}
          host={hosts.get(review.change.changeId)}
        />
      ))}
    </>
  );
}

function HostedChange({
  review,
  host,
}: {
  review: ReviewableChange;
  host: HTMLElement | undefined;
}) {
  return host ? createPortal(<ChangeCard review={review} />, host) : null;
}

function ChangeCard({ review }: { review: ReviewableChange }) {
  return (
    <div
      role="group"
      aria-label="Proposed change"
      className={styles.change}
      contentEditable={false}
    >
      <Words change={review.change} removes={review.removes} />
      {review.stale && <Moved />}
      <Bar review={review} />
    </div>
  );
}

/** The paragraph this change is about reads differently now, so its words were written against something else. */
function Moved() {
  return (
    <p className={styles.stale} role="alert">
      This paragraph changed after the agent read it.
    </p>
  );
}

function Bar({ review }: { review: ReviewableChange }) {
  return (
    <p className={styles.bar}>
      <button type="button" className={refine.refine} onClick={review.write}>
        {review.stale ? "Apply anyway" : "Accept"}
      </button>
      <button type="button" className={refine.quiet} onClick={review.discard}>
        Discard
      </button>
    </p>
  );
}

/** How a change that writes no words introduces the words it takes out, and what it says when there are none. */
interface Removal {
  caption: string;
  empty: string;
}

const CLEARS: Removal = {
  caption: "Clears this section:",
  empty: "Clears an empty section.",
};

const REMOVALS: Partial<Record<PlanChange["op"]["op"], Removal>> = {
  "remove-block": {
    caption: "Removes this paragraph:",
    empty: "Removes an empty paragraph.",
  },
  "set-section-text": CLEARS,
  "set-section-prose": CLEARS,
};

/** The change as a person reads it: the words it proposes, or the words it takes out when it writes none. */
function Words({
  change,
  removes,
}: {
  change: PlanChange;
  removes: readonly string[];
}): ReactNode {
  const words = changeWords(change);
  const removal = REMOVALS[change.op.op];

  if (words.length === 0 && removal) {
    return <Removed removal={removal} lines={removes} />;
  }

  return words.map((line, index) => (
    <p key={index} className={styles.words}>
      {line}
    </p>
  ));
}

interface RemovedProps {
  removal: Removal;
  lines: readonly string[];
}

/** The words a change takes out, repeated struck through so the card reads on its own: stacked under another card, at the end of a section, or read aloud. */
function Removed({ removal, lines }: RemovedProps): ReactNode {
  if (lines.length === 0) {
    return <p className={styles.caption}>{removal.empty}</p>;
  }

  return (
    <>
      <p className={styles.caption}>{removal.caption}</p>
      {lines.map((line, index) => (
        <p key={index} className={styles.dropped}>
          <del>{line}</del>
        </p>
      ))}
    </>
  );
}
