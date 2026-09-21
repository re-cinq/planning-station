import { BlockNoteSchema } from "@blocknote/core";
import { PROSE_BLOCK_SPECS } from "@re-cinq/planning-yjs";

import { PLAN_BLOCK_SPECS } from "../blocks/plan-block-specs.js";

export const planSchema = BlockNoteSchema.create({
  blockSpecs: { ...PROSE_BLOCK_SPECS, ...PLAN_BLOCK_SPECS },
});

export type PlanSchema = typeof planSchema;
