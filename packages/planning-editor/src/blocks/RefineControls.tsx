import type {
  LineChange,
  ProposedRefine,
  RefineProposal,
} from "@re-cinq/planning-document";
import { useState } from "react";
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
  /** Why the host last refused this section's ask; only this tab's person asked, so only they are told. */
  refusal: string | null;
}

type Refuse = (reason: string | null) => void;

/** Ask the agent for one section, then accept or discard what it proposes. */
export function RefineControls(props: RefineControlsProps) {
  const refine = useSectionRefine(props.doc, props.slot);
  const [refusal, setRefusal] = useState<string | null>(null);
  const ask = useAsk(props, refine, setRefusal);
  const view = { ...props, refine, ask, refusal };

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

/** A refused ask is withdrawn in every tab, and its reason stays on the section for the person who asked. */
function useAsk(
  { slot, title }: RefineControlsProps,
  refine: SectionRefine,
  refuse: Refuse,
) {
  const { user, onRefine } = usePlanActions();

  return () => {
    refuse(null);
    const asked = refine.ask(user.name);
    onRefine?.({ slot, title, ...asked }).catch((error: unknown) => {
      refine.discard();
      refuse(reasonOf(error));
    });
  };
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function RefineButton({ refine, ask, refusal }: Refining) {
  const ready = refine.settled > 0 && refine.busyFor === undefined;

  return (
    <>
      {refusal && <Refusal reason={refusal} />}
      <p className={styles.bar}>
        <button
          type="button"
          className={styles.refine}
          disabled={!ready}
          onClick={ask}
        >
          Refine this section
        </button>
        <span className={styles.note}>{buttonNote(refine)}</span>
      </p>
    </>
  );
}

function Refusal({ reason }: { reason: string }) {
  return (
    <p className={styles.failed} role="alert">
      The agent cannot refine this section now: {reason}
    </p>
  );
}

function buttonNote(refine: SectionRefine): string {
  if (refine.busyFor !== undefined) {
    return `The agent is refining another section for ${refine.busyFor}; refine this one when it finishes`;
  }

  return refine.settled > 0
    ? `uses ${settledPhrase(refine)}`
    : "Answer a question or resolve a thread to refine";
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
        <Primary
          label="Ask again"
          run={ask}
          disabled={refine.busyFor !== undefined}
        />
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
  const waiting = stale && refine.busyFor !== undefined;

  return (
    <p className={styles.bar}>
      <Primary label={label} run={run} disabled={waiting} />
      {stale && <Quiet label="Apply anyway" run={refine.applyAnyway} />}
      <Quiet label="Discard" run={refine.discard} />
    </p>
  );
}

interface PrimaryProps {
  label: string;
  run: () => void;
  disabled?: boolean;
}

function Primary({ label, run, disabled = false }: PrimaryProps) {
  return (
    <button
      type="button"
      className={styles.refine}
      disabled={disabled}
      onClick={run}
    >
      {label}
    </button>
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
