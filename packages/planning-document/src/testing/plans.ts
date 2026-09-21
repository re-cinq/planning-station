import { parseBlock, type BlockJson } from "../blocks/block-json.js";
import { inlineFromText, plainText } from "../blocks/inline-text.js";
import type { PlanKind, PlanMeta } from "../plan/plan-meta.js";
import { sectionOrder } from "../projection/partition.js";
import { seedBlocks } from "../projection/seed.js";
import { NOT_CONTENT } from "../template/slots.js";
import { templateFor } from "../template/templates.js";

const HEADING_PREFIX = "h-";

export type SectionContent = Readonly<Record<string, readonly BlockJson[]>>;

export function planMeta(type: PlanKind, title = "Faster checkout"): PlanMeta {
  return {
    schemaVersion: 1,
    id: "8e3c1f0a-1b2c-4d3e-8f40-123456789abc",
    repo: "acme/shop",
    type,
    templateVersion: 1,
    title,
    status: "draft",
    approval: null,
    version: 1,
    createdBy: "octocat",
    updatedAt: "2026-09-19T10:00:00.000Z",
  };
}

export function seededHeadings(type: PlanKind): BlockJson[] {
  return seedBlocks(templateFor(type), {
    title: "Faster checkout",
    idFor: (slot) => `${HEADING_PREFIX}${slot}`,
  });
}

export function planWith(type: PlanKind, content: SectionContent): BlockJson[] {
  return seededHeadings(type).flatMap((block) =>
    block.type === "section-panel"
      ? sectionOrder([block, ...(content[String(block.props["slot"])] ?? [])])
      : [block],
  );
}

/** A feature plan with everything approval asks for. */
export function readyFeature(): BlockJson[] {
  return planWith("feature", {
    intent: [textBlock("paragraph", {}, "Checkout takes too long.")],
    kpis: [
      textBlock(
        "kpi",
        { kpiId: "k1", metric: "p95", baseline: "450 ms", target: "200 ms" },
        "Every 100 ms costs a point of conversion.",
      ),
    ],
    scope: [textBlock("paragraph", {}, "Only the price lookup.")],
    prototype: [textBlock("prototype", { maturity: "click-dummy" }, "")],
    ownership: [textBlock("paragraph", {}, "Team checkout operates it.")],
  });
}

/** What people wrote in a section, without its comments, panel and actions. */
export function writtenBlocks<Block extends { type: string }>(
  blocks: readonly Block[] = [],
): Block[] {
  return blocks.filter((block) => !NOT_CONTENT.includes(block.type));
}

/** The text a block reads as; a table has none. */
export function blockText(block: BlockJson): string {
  return Array.isArray(block.content) ? plainText(block.content) : "";
}

export function textBlock(
  type: string,
  props: Record<string, unknown>,
  text: string,
): BlockJson {
  return parseBlock({
    id: `${type}-${text}`,
    type,
    props,
    content: inlineFromText(text),
  });
}
