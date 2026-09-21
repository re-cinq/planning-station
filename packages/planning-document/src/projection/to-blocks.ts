import { parseBlock, type BlockJson } from "../blocks/block-json.js";
import type { PlanDocument, Section } from "../plan/plan-document.js";
import { titleBlock } from "./seed.js";

export function toBlocks(
  plan: Pick<PlanDocument, "sections"> & Partial<Pick<PlanDocument, "title">>,
): BlockJson[] {
  const sections = plan.sections.flatMap((section) => [
    sectionHeading(section),
    ...section.blocks,
  ]);

  return plan.title ? [titleBlock(plan.title), ...sections] : sections;
}

function sectionHeading(section: Section): BlockJson {
  return parseBlock({
    id: section.headingId,
    type: "section-heading",
    props: { slot: section.slot, title: section.title },
  });
}
