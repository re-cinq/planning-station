import { isPlanBlock, type BlockJson } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { applyOps } from "../ops/apply-ops.js";
import { diffLines, type LineChange } from "../lib/diff-lines.js";
import type { ProposedRefine } from "./refine-proposal.js";
import { sectionHash, writtenIn } from "./section-hash.js";

export interface ProposalPreview {
  lines: LineChange[];
  /** The section changed after the refine was asked for, so the proposal is out of date. */
  stale: boolean;
}

/** What accepting the proposal would do to its section, line by line. */
export function previewProposal(
  blocks: readonly BlockJson[],
  proposal: ProposedRefine,
): ProposalPreview {
  const { slot } = proposal;
  const before = writtenIn(blocks, slot).flatMap(linesOf);
  const after = writtenIn(applyOps(blocks, proposal.ops), slot).flatMap(
    linesOf,
  );

  return {
    lines: diffLines(before, after),
    stale: sectionHash(blocks, slot) !== proposal.baseHash,
  };
}

function linesOf(block: BlockJson): string[] {
  const text = Array.isArray(block.content) ? plainText(block.content) : "";
  const own = isPlanBlock(block) ? [fieldsOf(block), text] : [text];
  const line = own.filter(Boolean).join(" — ");
  const nested = isPlanBlock(block) ? [] : block.children.flatMap(linesOf);

  return [line, ...nested].filter(Boolean);
}

function fieldsOf(block: BlockJson): string {
  return Object.entries(block.props)
    .filter(([name, value]) => isShown(name, value))
    .map(([, value]) => String(value))
    .join(" · ");
}

function isShown(name: string, value: unknown): boolean {
  return !name.endsWith("Id") && value !== "" && typeof value !== "boolean";
}
