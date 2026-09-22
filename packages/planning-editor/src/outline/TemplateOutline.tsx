import type { ReactNode } from "react";
import type {
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
  children?: ReactNode;
}

const NO_SECTIONS: readonly PlanSectionHeading[] = [];

export function TemplateOutline({
  template,
  report,
  sections = NO_SECTIONS,
  children,
}: TemplateOutlineProps) {
  return (
    <nav className={styles.outline} aria-label="Plan outline">
      <p className={styles.phase}>
        {report.passed ? "Ready for" : "Not ready for"} {report.phase}
      </p>
      <OutlineSlots template={template} report={report} sections={sections} />
      {children && <div className={styles.footer}>{children}</div>}
    </nav>
  );
}

function OutlineSlots({
  template,
  report,
  sections,
}: Required<Omit<TemplateOutlineProps, "children">>) {
  const problems = problemsBySlot(report.problems);

  return (
    <ol className={styles.slots}>
      {outlineSections(template, sections, report.phase).map((section) => (
        <OutlineSlot
          key={section.slot}
          section={section}
          problems={problems.get(section.slot) ?? []}
        />
      ))}
    </ol>
  );
}

interface OutlineSlotProps {
  section: OutlineSection;
  problems: readonly Problem[];
}

function OutlineSlot({ section, problems }: OutlineSlotProps) {
  return (
    <li aria-label={section.title}>
      <span className={styles.title}>{section.title}</span>
      {section.required && <span className={styles.required}> required</span>}
      <ul className={styles.problems}>
        {problems.map((problem) => (
          <li key={`${problem.code}-${problem.message}`}>{problem.message}</li>
        ))}
      </ul>
    </li>
  );
}
