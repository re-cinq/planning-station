import { type BlockJson } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { enforceTrue } from "../lib/enforce.js";
import type { Section } from "../plan/plan-document.js";
import { MARGIN_NOTES, SECTION_ACTIONS } from "../template/slots.js";

export class PlanShapeError extends Error {}

export const TITLE_BLOCK = "plan-title";

/** The feature name, which lives in the document above the first section. */
export function planTitle(blocks: readonly BlockJson[]): string | null {
  const title = blocks.find((block) => block.type === TITLE_BLOCK);

  return title && Array.isArray(title.content)
    ? plainText(title.content).trim()
    : null;
}

export function partitionSections(blocks: readonly BlockJson[]): Section[] {
  return blocks
    .filter((block) => block.type !== TITLE_BLOCK)
    .reduce<Section[]>((sections, block) => {
      if (block.type === "section-heading") {
        return [...sections, openSection(block.id, block.props)];
      }

      const current = sections.at(-1);
      enforceTrue(
        current,
        PlanShapeError,
        `block ${block.id} precedes the first section heading`,
      );

      return [
        ...sections.slice(0, -1),
        { ...current, blocks: [...current.blocks, block] },
      ];
    }, []);
}

/** A section's blocks in place: comments, its panel, what people wrote, its actions. */
export function sectionOrder(blocks: readonly BlockJson[]): BlockJson[] {
  const ofKind = (kind: string) =>
    blocks.filter((block) => block.type === kind);
  const notes = MARGIN_NOTES.flatMap(ofKind);
  const actions = ofKind(SECTION_ACTIONS);
  const placed = [...notes, ...actions];

  return [
    ...notes,
    ...blocks.filter((block) => !placed.includes(block)),
    ...actions,
  ];
}

function openSection(
  headingId: string,
  props: { slot: string; title: string },
): Section {
  return { headingId, slot: props.slot, title: props.title, blocks: [] };
}
