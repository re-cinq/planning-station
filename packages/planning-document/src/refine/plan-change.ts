import { z } from "zod";

import type { BlockJson } from "../blocks/block-json.js";
import { newId } from "../lib/ids.js";
import { shortHash } from "../lib/short-hash.js";
import { agentOpSchema, type AgentOp } from "../ops/agent-ops.js";
import type { ProseInput } from "../ops/prose-input.js";
import { plainText } from "../blocks/inline-text.js";
import { refineUsesSchema, type RefineUses } from "./refine-proposal.js";

/** One change a pass proposes, about ONE block: reviewed, accepted and refused on its own, where it lands. */
export const planChangeSchema = z.object({
  changeId: z.string().min(1),
  slot: z.string().min(1),
  /** The block this change is about: the one it rewrites or drops, the one new blocks follow, or null for the top of the section. */
  anchorId: z.string().nullable(),
  /** That block as the agent read it; the change is stale once it reads otherwise. */
  baseHash: z.string(),
  op: agentOpSchema,
  uses: refineUsesSchema,
  proposedBy: z.string(),
  proposedAt: z.string(),
});

export type PlanChange = z.infer<typeof planChangeSchema>;

/** What one pass proposes, before it is cut into changes. */
export interface PassOps {
  slot: string;
  ops: readonly AgentOp[];
  uses: RefineUses;
  proposedBy: string;
}

/** The pass, cut into one change per op and anchored to the blocks it is about. */
export function changesFor(
  blocks: readonly BlockJson[],
  pass: PassOps,
): PlanChange[] {
  const proposedAt = new Date().toISOString();

  return pass.ops.map((op) => ({
    changeId: newId("chg"),
    slot: pass.slot,
    anchorId: anchorOf(op),
    baseHash: blockHash(blocks, anchorOf(op)),
    op,
    uses: pass.uses,
    proposedBy: pass.proposedBy,
    proposedAt,
  }));
}

/** The block an op is about: the one it rewrites or drops, or the one its new blocks follow. */
export function anchorOf(op: AgentOp): string | null {
  if (op.op === "replace-block" || op.op === "remove-block") {
    return op.blockId;
  }

  return op.op === "insert-blocks" ? op.after : null;
}

/** One block as it reads now, hashed; empty for a block the plan no longer holds, or for no block at all. */
export function blockHash(
  blocks: readonly BlockJson[],
  blockId: string | null,
): string {
  const block = blockId
    ? blocks.find((candidate) => candidate.id === blockId)
    : undefined;

  return block ? shortHash(JSON.stringify(block)) : "";
}

/** The words a change proposes, one line per block: none for a change that only drops a paragraph, since what goes is the paragraph it hangs under. */
export function changeWords(change: PlanChange): string[] {
  const { op } = change;

  if (op.op === "replace-block") {
    return [wordsOf(op.block)];
  }

  return op.op === "insert-blocks" ? op.blocks.map(wordsOf) : [];
}

/** A table has rows rather than one line of content, and reads as its cells in order. */
function wordsOf(block: ProseInput): string {
  if ("content" in block) {
    return plainText(block.content);
  }

  const cells = block.rows.flat();

  return cells.map(plainText).join(" · ");
}
