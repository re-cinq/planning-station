import type {
  LineChange,
  ProposedRefine,
  RefineProposal,
} from "@re-cinq/planning-document";
import type { Doc } from "yjs";

import {
  useSectionRefine,
  type SectionRefine,
} from "../session/use-section-refine.js";
import { usePlanActions } from "./plan-actions.js";
import styles from "./RefineControls.module.scss";

export interface RefineControlsProps {
  doc: Doc;
  slot: string;
  title: string;
}

interface Refining extends RefineControlsProps {
  refine: SectionRefine;
  ask: () => void;
}

/** Ask the agent for one section, then accept or discard what it proposes. */
export function RefineControls(props: RefineControlsProps) {
  const refine = useSectionRefine(props.doc, props.slot);
  const ask = useAsk(props, refine);
  const view = { ...props, refine, ask };

  return refine.proposal ? (
    <RefineState {...view} proposal={refine.proposal} />
  ) : (
    <RefineButton {...view} />
  );
}

/** A section's refine once asked: waiting on the agent, answered, or failed. */
function RefineState({
  proposal,
  ...view
}: Refining & { proposal: RefineProposal }) {
  switch (proposal.status) {
    case "asked":
      return <Asked {...view} askedBy={proposal.askedBy} />;
    case "failed":
      return <Failed {...view} reason={proposal.reason} />;
    default:
      return <Proposal {...view} proposal={proposal} />;
  }
}

function useAsk({ slot, title }: RefineControlsProps, refine: SectionRefine) {
  const { user, onRefine } = usePlanActions();

  return () => {
    const asked = refine.ask(user.name);
    onRefine?.({ slot, title, ...asked }).catch(() => refine.discard());
  };
}

function RefineButton({ refine, ask }: Refining) {
  const settled = refine.settled > 0;

  return (
    <p className={styles.bar}>
      <button
        type="button"
        className={styles.refine}
        disabled={!settled}
        onClick={ask}
      >
        Refine this section
      </button>
      <span className={styles.note}>
        {settled
          ? `uses ${settledPhrase(refine)}`
          : "Answer a question or resolve a thread to refine"}
      </span>
    </p>
  );
}

function Asked({ refine, askedBy }: Refining & { askedBy: string }) {
  return (
    <p className={styles.bar} role="status">
      <span className={styles.note}>
        The agent is refining this for {askedBy}…
      </span>
      <button type="button" className={styles.quiet} onClick={refine.discard}>
        Withdraw
      </button>
    </p>
  );
}

/** Asking again overwrites the failure, whatever is settled by now: the person already chose to refine this section. */
function Failed({ refine, ask, reason }: Refining & { reason: string }) {
  return (
    <section className={styles.proposal}>
      <p className={styles.failed} role="alert">
        The agent could not refine this section: {reason}
      </p>
      <p className={styles.bar}>
        <button type="button" className={styles.refine} onClick={ask}>
          Ask again
        </button>
        <Quiet label="Dismiss" run={refine.discard} />
      </p>
    </section>
  );
}

function Proposal({ refine, ask, title, proposal }: Refining & Proposed) {
  const stale = refine.preview?.stale ?? false;

  return (
    <section className={styles.proposal} aria-label={`Proposal for ${title}`}>
      <p className={styles.note}>
        The agent proposes, for {proposal.askedBy}. {usedPhrase(proposal)}
      </p>
      <ProposedLines lines={refine.preview?.lines ?? []} />
      {stale && (
        <p className={styles.stale} role="alert">
          {title} changed after {proposal.askedBy} asked.
        </p>
      )}
      <ProposalButtons refine={refine} ask={ask} stale={stale} />
    </section>
  );
}

interface Proposed {
  proposal: ProposedRefine;
}

/** A stale proposal is asked for again, or applied anyway onto the section as it stands. */
function ProposalButtons({
  refine,
  ask,
  stale,
}: Pick<Refining, "refine" | "ask"> & { stale: boolean }) {
  const [label, run] = stale ? ["Ask again", ask] : ["Accept", refine.accept];

  return (
    <p className={styles.bar}>
      <button type="button" className={styles.refine} onClick={run}>
        {label}
      </button>
      {stale && <Quiet label="Apply anyway" run={refine.applyAnyway} />}
      <Quiet label="Discard" run={refine.discard} />
    </p>
  );
}

function Quiet({ label, run }: { label: string; run: () => void }) {
  return (
    <button type="button" className={styles.quiet} onClick={run}>
      {label}
    </button>
  );
}

function ProposedLines({ lines }: { lines: readonly LineChange[] }) {
  return (
    <ul className={styles.lines}>
      {lines.map((line, index) => (
        <li key={`${index}-${line.text}`} className={styles[line.kind]}>
          <LineText line={line} />
        </li>
      ))}
    </ul>
  );
}

function LineText({ line }: { line: LineChange }) {
  if (line.kind === "added") {
    return <ins>{line.text}</ins>;
  }

  return line.kind === "removed" ? <del>{line.text}</del> : line.text;
}

function settledPhrase({ inputs }: SectionRefine): string {
  return countsPhrase(inputs.answered.length, inputs.resolved.length);
}

function usedPhrase({ uses }: ProposedRefine): string {
  const used = countsPhrase(uses.questions.length, uses.comments.length);

  return used ? `It uses ${used}.` : "";
}

function countsPhrase(answers: number, threads: number): string {
  return [counted(answers, "answer"), counted(threads, "resolved thread")]
    .filter(Boolean)
    .join(", ");
}

function counted(count: number, noun: string): string {
  if (count === 0) {
    return "";
  }

  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
