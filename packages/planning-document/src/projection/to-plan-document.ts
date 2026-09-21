import type { BlockJson } from "../blocks/block-json.js";
import type { PlanDocument } from "../plan/plan-document.js";
import type { PlanMeta } from "../plan/plan-meta.js";
import { kpisOf, prototypeOf } from "./derive-views.js";
import { partitionSections, planTitle } from "./partition.js";

export function toPlanDocument(
  blocks: readonly BlockJson[],
  meta: PlanMeta,
): PlanDocument {
  const sections = partitionSections(blocks);
  const everyBlock = sections.flatMap((section) => section.blocks);

  return {
    ...meta,
    title: planTitle(blocks) || meta.title,
    sections,
    kpis: kpisOf(everyBlock),
    prototype: prototypeOf(everyBlock),
  };
}
