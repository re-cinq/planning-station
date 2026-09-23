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

/** A pass never writes what validation would flag, and never touches what a person already wrote. A refused block the pass repeats as it stands is the person's and is compared as unchanged, so what the pass adds beside it anchors to it; one the pass left out leaves the comparison, so it is never removed; one the pass wrote itself is dropped and reported. A section with no known slot is compared whole. */
export function judgeProse(
  slot: SectionSlot | undefined,
  live: ProseBlock[],
  written: ProseInput[],
): JudgedProse {
  if (!slot) {
    return { live, written, problems: [] };
  }

  const judge = judgeIn(slot, live);

  return {
    live: comparedLive(judge, live, written),
    written: written.filter(
      (block) => judge.allows(block) || judge.repeats(block),
    ),
    problems: written
      .filter(judge.refuses)
      .map((block) => refusal(slot, block)),
  };
}

/** The live side of the comparison: what the slot allows, and a person's refused block only where the pass repeats it. */
function comparedLive(
  judge: Judge,
  live: ProseBlock[],
  written: readonly ProseInput[],
): ProseBlock[] {
  const repeated = new Set(written.filter(judge.repeats).map(judge.keyOf));

  return live.filter(
    (block) => judge.allows(block) || repeated.has(canonical(block)),
  );
}

/** How one section judges the prose written into it, against the refused blocks people already wrote there. */
interface Judge {
  allows(block: { type: string }): boolean;
  /** A refused block that repeats one a person wrote, exactly as it stands. */
  repeats(block: ProseInput): boolean;
  /** A refused block the pass wrote itself. */
  refuses(block: ProseInput): boolean;
  keyOf(block: ProseInput): string;
}

function judgeIn(slot: SectionSlot, live: readonly ProseBlock[]): Judge {
  const allows = (block: { type: string }) => allowsBlock(slot, block.type);
  const keyOf = (block: ProseInput) => canonicalInput(slot.slot, block);
  const standing = new Set(
    live.filter((block) => !allows(block)).map(canonical),
  );
  const repeats = (block: ProseInput) =>
    !allows(block) && standing.has(keyOf(block));

  return {
    allows,
    repeats,
    refuses: (block) => !allows(block) && !repeats(block),
    keyOf,
  };
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
