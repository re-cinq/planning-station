import type { ProseBlock } from "../blocks/prose-blocks.js";
import { toProseBlocks, type ProseInput } from "../ops/prose-input.js";
import { allowsBlock, disallowedBlockMessage } from "../template/slots.js";
import type { SectionSlot } from "../template/template.js";
import type { MarkdownProblem } from "./markdown-outcome.js";
import { writeProse } from "./write-prose.js";

/** Both sides of a section's prose, with what its slot has no place for taken out before they are compared. */
export interface JudgedProse {
  live: ProseBlock[];
  written: ProseInput[];
  problems: MarkdownProblem[];
}

/** A pass never writes what validation would flag, and never touches what a person already wrote: a block the slot refuses is out of the comparison on both sides, and reported only when the pass wrote it. A section with no known slot is compared whole. */
export function judgeProse(
  slot: SectionSlot | undefined,
  live: ProseBlock[],
  written: ProseInput[],
): JudgedProse {
  if (!slot) {
    return { live, written, problems: [] };
  }

  return {
    live: live.filter((block) => allowsBlock(slot, block.type)),
    written: written.filter((block) => allowsBlock(slot, block.type)),
    problems: refusedWrites(slot, live, written),
  };
}

/** The refused blocks the pass wrote itself; one that only repeats a person's refused block as it stands is theirs, not the pass's. */
function refusedWrites(
  slot: SectionSlot,
  live: readonly ProseBlock[],
  written: readonly ProseInput[],
): MarkdownProblem[] {
  const standing = new Set(
    live.filter((block) => !allowsBlock(slot, block.type)).map(canonical),
  );

  return written
    .filter((block) => !allowsBlock(slot, block.type))
    .filter((block) => !standing.has(canonicalInput(slot.slot, block)))
    .map((block) => refusal(slot, block));
}

function refusal(slot: SectionSlot, block: ProseInput): MarkdownProblem {
  return {
    code: "disallowed-block",
    slot: slot.slot,
    message: disallowedBlockMessage(slot, block.type),
  };
}

function canonical(block: ProseBlock): string {
  return writeProse([block]).join("\n");
}

function canonicalInput(slot: string, block: ProseInput): string {
  return writeProse(toProseBlocks(slot, [block])).join("\n");
}
