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
import styles from "./TemplateOutline.module.scss";

export interface TemplateOutlineProps {
  template: PlanTemplate;
  report: ValidationReport;
  /** The plan's sections in document order; without them the outline lists the template's. */
  sections?: readonly PlanSectionHeading[];
  /** Once the plan is approved, the outline says by whom instead of whether it is ready. */
  approval?: PlanMeta["approval"];
  /** Per slot, settled input no refine has used. Resolving a thread decides it; only a refine writes it in, so without this the outline reads as handled while nothing was written. */
  settled?: ReadonlyMap<string, number>;
  /** Brings a section's heading into view; without it the titles are plain text. */
  onLocate?: (slot: string) => void;
  children?: ReactNode;
}

const NO_SECTIONS: readonly PlanSectionHeading[] = [];
const NO_SETTLED: ReadonlyMap<string, number> = new Map();

export function TemplateOutline({
  approval = null,
  children,
  ...slots
}: TemplateOutlineProps) {
  return (
    <nav className={styles.outline} aria-label="Plan outline">
      <p className={styles.phase}>
        {approval ? approvedLine(approval) : readinessLine(slots.report)}
      </p>
      <OutlineSlots {...slots} />
      {children && <div className={styles.footer}>{children}</div>}
    </nav>
  );
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
  "template" | "report" | "sections" | "settled" | "onLocate"
>;

function OutlineSlots(props: OutlineSlotsProps) {
  return (
    <ol className={styles.slots}>
      {slotRows(props).map((row) => (
        <OutlineSlot key={row.section.slot} {...row} />
      ))}
    </ol>
  );
}

function slotRows({
  template,
  report,
  sections = NO_SECTIONS,
  settled = NO_SETTLED,
  onLocate,
}: OutlineSlotsProps): OutlineSlotProps[] {
  const problems = problemsBySlot(report.problems);

  return outlineSections(template, sections, report.phase).map((section) => ({
    section,
    problems: problems.get(section.slot) ?? [],
    settled: settled.get(section.slot) ?? 0,
    onLocate,
  }));
}

interface OutlineSlotProps {
  section: OutlineSection;
  problems: readonly Problem[];
  settled: number;
  onLocate?: (slot: string) => void;
}

function OutlineSlot({ problems, settled, ...locatable }: OutlineSlotProps) {
  const { section } = locatable;

  return (
    <li aria-label={section.title}>
      <SlotTitle {...locatable} />
      {section.required && <span className={styles.required}> required</span>}
      {settled > 0 && (
        <span className={styles.settled}> {settledPhrase(settled)}</span>
      )}
      <ul className={styles.problems}>
        {problems.map((problem) => (
          <li key={`${problem.code}-${problem.message}`}>{problem.message}</li>
        ))}
      </ul>
    </li>
  );
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
