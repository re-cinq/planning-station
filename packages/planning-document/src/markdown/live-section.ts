import {
  blocksOfType,
  isPlanBlock,
  type BlockJson,
  type PlanBlockOf,
} from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { KpiInput, PrototypeInput } from "../ops/agent-ops.js";
import type { Section } from "../plan/plan-document.js";
import type { PlanTemplate } from "../template/template.js";
import { findSectionSlot } from "../template/templates.js";

/** A heading's own title wins: templates retitle sections, and the agent titles its own. */
export function sectionTitle(section: Section, template: PlanTemplate): string {
  return (
    section.title ||
    findSectionSlot(template, section.slot)?.title ||
    section.slot
  );
}

export function liveProse(section: Section): ProseBlock[] {
  return section.blocks.filter(
    (block): block is ProseBlock => !isPlanBlock(block),
  );
}

export function kpiInputOf(block: PlanBlockOf<"kpi">): KpiInput {
  const { kpiId, metric, baseline, target, direction, deadline } = block.props;

  return {
    kpiId,
    metric,
    baseline,
    target,
    direction,
    deadline,
    rationale: plainText(block.content),
  };
}

export function prototypeInputOf(
  block: PlanBlockOf<"prototype">,
): PrototypeInput {
  const { maturity, url, agreedBy } = block.props;

  return { maturity, url, agreedBy, notes: plainText(block.content) };
}

export function liveKpis(
  blocks: readonly BlockJson[],
): ReadonlyMap<string, KpiInput> {
  return new Map(
    blocksOfType(blocks, "kpi").map((block) => [
      block.props.kpiId,
      kpiInputOf(block),
    ]),
  );
}

export function livePrototype(
  blocks: readonly BlockJson[],
): PrototypeInput | null {
  const [first] = blocksOfType(blocks, "prototype");

  return first ? prototypeInputOf(first) : null;
}
