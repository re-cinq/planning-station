import {
  diffPlans,
  type EntityChange,
  type LineChange,
  type MetaChange,
  type PlanDocument,
  type SectionDiff,
} from "@re-cinq/planning-document";

import styles from "./PlanDiffView.module.scss";

export interface PlanDiffViewProps {
  before: PlanDocument;
  after: PlanDocument;
  className?: string;
}

const LINE_MARK: Record<LineChange["kind"], string> = {
  kept: " ",
  added: "+",
  removed: "-",
};

/** What one version of a plan changed against another, for a reader. */
export function PlanDiffView({ before, after, className }: PlanDiffViewProps) {
  const diff = diffPlans(before, after);
  const nothing = diff.sections.length === 0 && diff.meta.length === 0;

  return (
    <section
      className={[styles.diff, "ps-diff", className].filter(Boolean).join(" ")}
      aria-label={`Changes from version ${before.version} to ${after.version}`}
    >
      {nothing && <p className={styles.same}>Nothing changed</p>}
      <MetaChanges changes={diff.meta} />
      {diff.sections.map((section) => (
        <SectionChanges key={section.slot} section={section} />
      ))}
      <EntityChanges what="Success criteria" changes={diff.kpis} />
    </section>
  );
}

function MetaChanges({ changes }: { changes: readonly MetaChange[] }) {
  return (
    <ul className={styles.meta}>
      {changes.map((change) => (
        <li key={change.field}>
          {change.field}: {change.before} to {change.after}
        </li>
      ))}
    </ul>
  );
}

function SectionChanges({ section }: { section: SectionDiff }) {
  return (
    <article aria-label={section.title}>
      <h3 className={styles.title}>{section.title}</h3>
      <ol className={styles.lines}>
        {section.lines.map((line, index) => (
          <li key={`${line.kind}-${index}`} className={styles[line.kind]}>
            <span aria-hidden="true">{LINE_MARK[line.kind]} </span>
            {line.text}
          </li>
        ))}
      </ol>
    </article>
  );
}

interface EntityChangesProps {
  what: string;
  changes: readonly EntityChange[];
}

function EntityChanges({ what, changes }: EntityChangesProps) {
  if (changes.length === 0) {
    return null;
  }

  return (
    <article aria-label={what}>
      <h3 className={styles.title}>{what}</h3>
      <ul className={styles.lines}>
        {changes.map((change) => (
          <li key={change.id} className={styles[change.kind]}>
            {change.id} {change.kind}
          </li>
        ))}
      </ul>
    </article>
  );
}
