import { blocksOfType } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import type { Section } from "../plan/plan-document.js";
import { isAtLeast, type Check, type Problem } from "./problems.js";

/** A finding the review raised holds approval until someone resolves it. */
export const unresolvedFindings: Check = ({ plan: { sections }, phase }) =>
  isAtLeast(phase, "approval") ? sections.flatMap(unresolvedIn) : [];

function unresolvedIn({ slot, blocks }: Section): Problem[] {
  return blocksOfType(blocks, "finding")
    .filter((finding) => !finding.props.resolved)
    .map((finding) => ({
      code: "unresolved-finding",
      slot,
      blockId: finding.id,
      message: `finding "${plainText(finding.content)}" is unresolved`,
    }));
}
