import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  changeWords,
  type BlockJson,
  type PlanChange,
} from "@re-cinq/planning-document";

import type { ChangeHosts } from "./change-hosts.js";
import type { Removal, ReviewableChange } from "../session/use-plan-changes.js";
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

/** The change as a person reads it: the words it proposes, or the words it takes out when it writes none. */
function Words({
  change,
  removes,
}: {
  change: PlanChange;
  removes: Removal | undefined;
}): ReactNode {
  if (removes) {
    return <Removed removal={removes} />;
  }

  return changeWords(change).map((line, index) => (
    <p key={index} className={styles.words}>
      {line}
    </p>
  ));
}

/** The words a change takes out, repeated struck through so the card reads on its own: stacked under another card, at the end of a section, or read aloud. */
function Removed({ removal }: { removal: Removal }): ReactNode {
  const verb = removal.takes === "section" ? "Clears" : "Removes";
  const what = removal.takes === "section" ? "section" : nounOf(removal.type);

  if (removal.lines.length === 0) {
    return <p className={styles.caption}>{`${verb} an empty ${what}.`}</p>;
  }

  return (
    <>
      <p className={styles.caption}>{`${verb} this ${what}:`}</p>
      {removal.lines.map((line, index) => (
        <p key={index} className={styles.dropped}>
          <del>{line}</del>
        </p>
      ))}
    </>
  );
}

/** What a removed block is called, for the kinds a person would name; any other reads as a block. */
const NOUNS: Partial<Record<BlockJson["type"], string>> = {
  paragraph: "paragraph",
  heading: "heading",
  bulletListItem: "item",
  numberedListItem: "item",
  checkListItem: "item",
  quote: "quote",
  codeBlock: "code block",
  table: "table",
  question: "question",
  answer: "answer",
  comment: "comment",
  finding: "finding",
  kpi: "KPI",
  prototype: "prototype",
};

function nounOf(type: BlockJson["type"]): string {
  return NOUNS[type] ?? "block";
}
