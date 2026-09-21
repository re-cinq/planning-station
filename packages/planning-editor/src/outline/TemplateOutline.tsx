import type { ReactNode } from "react";
import {
  isRequiredAt,
  type Problem,
  type SectionSlot,
  type PlanTemplate,
  type ValidationPhase,
  type ValidationReport,
} from "@re-cinq/planning-document";

import { problemsBySlot } from "./problems-by-slot.js";
import styles from "./TemplateOutline.module.scss";

export interface TemplateOutlineProps {
  template: PlanTemplate;
  report: ValidationReport;
  children?: ReactNode;
}

export function TemplateOutline({
  template,
  report,
  children,
}: TemplateOutlineProps) {
  return (
    <nav className={styles.outline} aria-label="Plan outline">
      <p className={styles.phase}>
        {report.passed ? "Ready for" : "Not ready for"} {report.phase}
      </p>
      <OutlineSlots template={template} report={report} />
      {children && <div className={styles.footer}>{children}</div>}
    </nav>
  );
}

function OutlineSlots({ template, report }: TemplateOutlineProps) {
  const problems = problemsBySlot(report.problems);

  return (
    <ol className={styles.slots}>
      {template.slots.map((slot) => (
        <OutlineSlot
          key={slot.slot}
          slot={slot}
          phase={report.phase}
          problems={problems.get(slot.slot) ?? []}
        />
      ))}
    </ol>
  );
}

interface OutlineSlotProps {
  slot: SectionSlot;
  phase: ValidationPhase;
  problems: readonly Problem[];
}

function OutlineSlot({ slot, phase, problems }: OutlineSlotProps) {
  return (
    <li aria-label={slot.title}>
      <span className={styles.title}>{slot.title}</span>
      {isRequiredAt(slot.required, phase) && (
        <span className={styles.required}> required</span>
      )}
      <ul className={styles.problems}>
        {problems.map((problem) => (
          <li key={`${problem.code}-${problem.message}`}>{problem.message}</li>
        ))}
      </ul>
    </li>
  );
}
