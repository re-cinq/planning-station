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
}

export function TemplateOutline({ template, report }: TemplateOutlineProps) {
  const problems = problemsBySlot(report.problems);

  return (
    <nav className={styles.outline} aria-label="Plan outline">
      <p className={styles.phase}>
        {report.passed ? "Ready for" : "Not ready for"} {report.phase}
      </p>
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
    </nav>
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
