import {
  blocksOfType,
  isPlanBlock,
  type BlockJson,
} from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import type { Section } from "../plan/plan-document.js";
import {
  allowsBlock,
  disallowedBlockMessage,
  NOT_CONTENT,
} from "../template/slots.js";
import type {
  BlockRequirement,
  PlanTemplate,
  SectionSlot,
} from "../template/template.js";
import { findSectionSlot, isCustomSlot } from "../template/templates.js";
import {
  isAtLeast,
  isRequiredAt,
  type Check,
  type Problem,
  type ValidationPhase,
} from "./problems.js";

export const missingSections: Check = ({
  plan: { sections },
  template: { slots },
  phase,
}) => {
  const present = new Set(sections.map((section) => section.slot));

  return slots
    .filter(
      (slot) => isRequiredAt(slot.required, phase) && !present.has(slot.slot),
    )
    .map((slot) => ({
      code: "missing-section",
      slot: slot.slot,
      message: `"${slot.title}" is missing`,
    }));
};

export const unknownSections: Check = ({ plan: { sections }, template }) => {
  const known = new Set(template.slots.map((slot) => slot.slot));

  return sections
    .filter(
      (section) => !known.has(section.slot) && !isCustomSlot(section.slot),
    )
    .map((section) => ({
      code: "unknown-section",
      slot: section.slot,
      message: `"${section.title}" is not part of the ${template.type} template`,
    }));
};

export const sectionOrder: Check = ({ plan: { sections }, template }) => {
  const rank = new Map(template.slots.map((slot, index) => [slot.slot, index]));
  const ranked = sections.filter((section) => rank.has(section.slot));

  return ranked
    .filter(
      (section, index) =>
        index > 0 && rankOf(rank, section) <= rankOf(rank, ranked[index - 1]),
    )
    .map((section) => ({
      code: "section-out-of-order",
      slot: section.slot,
      message: `"${section.title}" is out of template order`,
    }));
};

export const disallowedBlocks: Check = ({ plan: { sections }, template }) =>
  sectionsWithSlots(sections, template).flatMap(
    ({ section: { blocks }, slot }) =>
      blocks
        .filter((block) => !allowsBlock(slot, block.type))
        .map((block) => ({
          code: "disallowed-block" as const,
          slot: slot.slot,
          blockId: block.id,
          message: disallowedBlockMessage(slot, block.type),
        })),
  );

export const emptyRequiredSections: Check = ({
  plan: { sections },
  template,
  phase,
}) =>
  isAtLeast(phase, "approval")
    ? requiredSections(sections, template, phase)
        .filter(({ section }) => !section.blocks.some(isMeaningful))
        .map(({ slot }) => ({
          code: "empty-required-section",
          slot: slot.slot,
          message: `"${slot.title}" needs content`,
        }))
    : [];

export const blockRequirements: Check = ({
  plan: { sections },
  template,
  phase,
}) =>
  isAtLeast(phase, "approval")
    ? requiredSections(sections, template, phase).flatMap(({ section, slot }) =>
        slot.requires.flatMap((requirement) =>
          countProblems(section.blocks, slot, requirement),
        ),
      )
    : [];

type CountCode = "missing-block" | "too-many-blocks";

function countProblems(
  blocks: readonly BlockJson[],
  slot: SectionSlot,
  requirement: BlockRequirement,
): Problem[] {
  const count = blocks.filter(
    (block) => block.type === requirement.block,
  ).length;
  const code = countCode(count, requirement);

  return code
    ? [
        {
          code,
          slot: slot.slot,
          message: countMessage(code, slot, requirement),
        },
      ]
    : [];
}

function countCode(
  count: number,
  requirement: BlockRequirement,
): CountCode | null {
  if (count < requirement.min) {
    return "missing-block";
  }

  const tooMany = requirement.max !== undefined && count > requirement.max;

  return tooMany ? "too-many-blocks" : null;
}

function countMessage(
  code: CountCode,
  slot: SectionSlot,
  requirement: BlockRequirement,
): string {
  const { min, max, block } = requirement;

  return code === "missing-block"
    ? `"${slot.title}" needs at least ${min} ${block}`
    : `"${slot.title}" allows at most ${max ?? min} ${block}`;
}

export const unresolvedFindings: Check = ({ plan: { sections }, phase }) =>
  isAtLeast(phase, "approval")
    ? sections.flatMap(({ slot, blocks }) =>
        blocksOfType(blocks, "finding")
          .filter((finding) => !finding.props.resolved)
          .map((finding) => ({
            code: "unresolved-finding" as const,
            slot,
            blockId: finding.id,
            message: `finding "${plainText(finding.content)}" is unresolved`,
          })),
      )
    : [];

interface SectionWithSlot {
  section: Section;
  slot: SectionSlot;
}

function sectionsWithSlots(
  sections: readonly Section[],
  template: PlanTemplate,
): SectionWithSlot[] {
  return sections.flatMap((section) => {
    const slot = findSectionSlot(template, section.slot, section.title);

    return slot ? [{ section, slot }] : [];
  });
}

function requiredSections(
  sections: readonly Section[],
  template: PlanTemplate,
  phase: ValidationPhase,
): SectionWithSlot[] {
  return sectionsWithSlots(sections, template).filter(({ slot }) =>
    isRequiredAt(slot.required, phase),
  );
}

function rankOf(
  rank: ReadonlyMap<string, number>,
  section: Section | undefined,
): number {
  return rank.get(section?.slot ?? "") ?? -1;
}

function isMeaningful(block: BlockJson): boolean {
  if (NOT_CONTENT.includes(block.type)) {
    return false;
  }

  if (isPlanBlock(block) || block.children.length > 0) {
    return true;
  }

  return Array.isArray(block.content)
    ? plainText(block.content).trim() !== ""
    : true;
}
