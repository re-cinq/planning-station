import { plainText } from "../blocks/inline-text.js";
import type { PlanDocument, Section } from "../plan/plan-document.js";
import { diffLines, type LineChange } from "./diff-lines.js";

export const ENTITY_CHANGES = ["added", "removed", "changed"] as const;

export type EntityChangeKind = (typeof ENTITY_CHANGES)[number];

export interface EntityChange {
  id: string;
  kind: EntityChangeKind;
}

export interface SectionDiff {
  slot: string;
  title: string;
  lines: LineChange[];
}

export interface MetaChange {
  field: string;
  before: string;
  after: string;
}

export interface PlanDiff {
  meta: MetaChange[];
  sections: SectionDiff[];
  kpis: EntityChange[];
}

interface Identified {
  id: string;
}

const META_FIELDS = ["title", "status", "version"] as const;

/** What changed between two versions of a plan, in the words people wrote. */
export function diffPlans(before: PlanDocument, after: PlanDocument): PlanDiff {
  return {
    meta: metaChanges(before, after),
    sections: sectionDiffs(before, after),
    kpis: entityChanges(before.kpis, after.kpis),
  };
}

/** A section with only kept lines is left out, so a diff shows the changes. */
function sectionDiffs(
  before: PlanDocument,
  after: PlanDocument,
): SectionDiff[] {
  const was = new Map(
    before.sections.map((section) => [section.slot, section]),
  );

  const diffs = after.sections.map((section) => ({
    slot: section.slot,
    title: section.title,
    lines: diffLines(linesOf(was.get(section.slot)), linesOf(section)),
  }));

  return diffs.filter((diff) =>
    diff.lines.some((line) => line.kind !== "kept"),
  );
}

/** A table's cells are not prose, so it counts as one unreadable line. */
function linesOf(section: Section | undefined): string[] {
  return (section?.blocks ?? []).map((block) =>
    Array.isArray(block.content) ? plainText(block.content) : block.type,
  );
}

function entityChanges(
  before: readonly Identified[],
  after: readonly Identified[],
): EntityChange[] {
  const was = fingerprints(before);
  const now = fingerprints(after);

  return [
    ...after
      .filter((entity) => was.get(entity.id) !== now.get(entity.id))
      .map((entity) => ({
        id: entity.id,
        kind: was.has(entity.id) ? ("changed" as const) : ("added" as const),
      })),
    ...before
      .filter((entity) => !now.has(entity.id))
      .map((entity) => ({ id: entity.id, kind: "removed" as const })),
  ];
}

function fingerprints(entities: readonly Identified[]): Map<string, string> {
  return new Map(entities.map((entity) => [entity.id, JSON.stringify(entity)]));
}

function metaChanges(before: PlanDocument, after: PlanDocument): MetaChange[] {
  return META_FIELDS.filter(
    (field) => String(before[field]) !== String(after[field]),
  ).map((field) => ({
    field,
    before: String(before[field]),
    after: String(after[field]),
  }));
}
