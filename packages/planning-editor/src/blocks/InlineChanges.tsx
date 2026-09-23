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
      <Words change={review.change} />
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

/** What a change that writes no words does, for the ops where that is something a person must be told. */
const NOTHING_WRITTEN: Partial<Record<PlanChange["op"]["op"], string>> = {
  "remove-block": "This paragraph goes.",
  "set-section-text": "This section is cleared.",
  "set-section-prose": "This section is cleared.",
};

/** The change as a person reads it: the words it proposes, or what writing none of them does. */
function Words({ change }: { change: PlanChange }): ReactNode {
  const words = changeWords(change);
  const warning = NOTHING_WRITTEN[change.op.op];

  return words.length === 0 && warning ? (
    <p className={styles.dropped}>{warning}</p>
  ) : (
    words.map((line, index) => (
      <p key={index} className={styles.words}>
        {line}
      </p>
    ))
  );
}
