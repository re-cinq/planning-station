import type { ReactNode } from "react";
import type {
  PlanMeta,
  Problem,
  PlanTemplate,
  ValidationReport,
} from "@re-cinq/planning-document";

import {
  outlineSections,
  type OutlineSection,
  type PlanSectionHeading,
} from "./outline-sections.js";
import { problemsBySlot } from "./problems-by-slot.js";
import {
  requiredProgress,
  sectionState,
  type RequiredProgress,
  type SectionState,
} from "./section-state.js";
import styles from "./TemplateOutline.module.scss";

export interface TemplateOutlineProps {
  template: PlanTemplate;
  report: ValidationReport;
  /** The plan's sections in document order; without them the outline lists the template's. */
  sections?: readonly PlanSectionHeading[];
  /** The template slots removed from the plan, which the outline no longer lists as missing. */
  droppedSlots?: readonly string[];
  /** Once the plan is approved, the outline says by whom instead of whether it is ready. */
  approval?: PlanMeta["approval"];
  /** Per slot, settled input no refine has used. Resolving a thread decides it; only a refine writes it in, so without this the outline reads as handled while nothing was written. */
  settled?: ReadonlyMap<string, number>;
  /** Per slot, why the agent's last refine of that section failed. */
  failed?: ReadonlyMap<string, string>;
  /** Brings a section's heading into view; without it the titles are plain text. */
  onLocate?: (slot: string) => void;
  children?: ReactNode;
}

const NO_SECTIONS: readonly PlanSectionHeading[] = [];
const NO_SETTLED: ReadonlyMap<string, number> = new Map();
const NO_FAILURES: ReadonlyMap<string, string> = new Map();

export function TemplateOutline({
  approval = null,
  children,
  ...slots
}: TemplateOutlineProps) {
  const rows = slotRows(slots);

  return (
    <nav className={styles.outline} aria-label="Plan outline">
      <p className={styles.phase}>{phaseLine(approval, slots.report)}</p>
      {!approval && <Progress {...requiredProgress(rows)} />}
      <ol className={styles.slots}>
        {rows.map((row) => (
          <OutlineSlot key={row.section.slot} {...row} />
        ))}
      </ol>
      {children && <div className={styles.footer}>{children}</div>}
    </nav>
  );
}

function Progress({ ready, total }: RequiredProgress) {
  if (total === 0) {
    return null;
  }

  return (
    <>
      <p className={styles.progress}>
        {ready} of {total} required sections ready
      </p>
      <progress
        className={styles.bar}
        aria-label="Required sections ready"
        value={ready}
        max={total}
      />
    </>
  );
}

function phaseLine(
  approval: PlanMeta["approval"],
  report: ValidationReport,
): string {
  return approval ? approvedLine(approval) : readinessLine(report);
}

function readinessLine(report: ValidationReport): string {
  return `${report.passed ? "Ready for" : "Not ready for"} ${report.phase}`;
}

function approvedLine({
  approvedBy,
  approvedAt,
}: NonNullable<PlanMeta["approval"]>): string {
  return `Approved by ${approvedBy} on ${dateOf(approvedAt)}`;
}

function dateOf(iso: string): string {
  const when = new Date(iso);

  return Number.isNaN(when.getTime()) ? iso : when.toLocaleDateString();
}

type OutlineSlotsProps = Pick<
  TemplateOutlineProps,
  | "template"
  | "report"
  | "sections"
  | "droppedSlots"
  | "settled"
  | "failed"
  | "onLocate"
>;

function slotRows({
  template,
  report,
  sections = NO_SECTIONS,
  droppedSlots,
  settled = NO_SETTLED,
  failed = NO_FAILURES,
  onLocate,
}: OutlineSlotsProps): OutlineSlotProps[] {
  const problems = problemsBySlot(report.problems);
  const plan = { sections, droppedSlots };

  return outlineSections(template, plan, report.phase).map((section) => ({
    section,
    problems: problems.get(section.slot) ?? [],
    settled: settled.get(section.slot) ?? 0,
    failure: failed.get(section.slot),
    onLocate,
  }));
}

interface OutlineSlotProps {
  section: OutlineSection;
  problems: readonly Problem[];
  settled: number;
  failure?: string;
  onLocate?: (slot: string) => void;
}

const STATE_PHRASES: Readonly<Record<SectionState, string>> = {
  ready: "ready",
  problem: "needs work",
  missing: "not in the plan",
};

const STATE_MARKS: Readonly<Record<SectionState, string>> = {
  ready: "✓",
  problem: "!",
  missing: "",
};

function OutlineSlot({
  problems,
  settled,
  failure,
  ...locatable
}: OutlineSlotProps) {
  const { section } = locatable;
  const state = sectionState(section, problems);

  return (
    <li
      className={styles.slot}
      aria-label={`${section.title}, ${STATE_PHRASES[state]}`}
    >
      <SlotMark state={state} />
      <SlotTitle {...locatable} />
      {section.required && <span className={styles.required}>required</span>}
      <SlotNotes problems={problems} settled={settled} failure={failure} />
    </li>
  );
}

function SlotMark({ state }: { state: SectionState }) {
  return (
    <span className={styles.mark} aria-hidden="true" data-state={state}>
      {STATE_MARKS[state]}
    </span>
  );
}

function SlotNotes({
  problems,
  settled,
  failure,
}: Pick<OutlineSlotProps, "problems" | "settled" | "failure">) {
  return (
    <>
      <WarningNote text={settled > 0 && settledPhrase(settled)} />
      <WarningNote text={failure && `Refine failed: ${failure}`} />
      <ul className={styles.problems}>
        {problems.map((problem) => (
          <li key={`${problem.code}-${problem.message}`}>{problem.message}</li>
        ))}
      </ul>
    </>
  );
}

function WarningNote({ text }: { text?: string | false }) {
  return text && <span className={styles.settled}>{text}</span>;
}

// A section the plan lacks has no heading to go to, so its title stays text.
function SlotTitle({
  section,
  onLocate,
}: Pick<OutlineSlotProps, "section" | "onLocate">) {
  if (!onLocate || !section.inPlan) {
    return <span className={styles.title}>{section.title}</span>;
  }

  return (
    <button
      type="button"
      className={styles.locate}
      onClick={() => onLocate(section.slot)}
    >
      {section.title}
    </button>
  );
}

function settledPhrase(settled: number): string {
  const inputs = settled === 1 ? "settled input" : "settled inputs";

  return `${settled} ${inputs} waiting for a refine`;
}
