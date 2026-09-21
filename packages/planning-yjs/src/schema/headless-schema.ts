import {
  BlockNoteSchema,
  createBlockSpec,
  type BlockConfig,
  type PropSchema,
} from "@blocknote/core";
import {
  PLAN_BLOCK_CONFIGS,
  PLAN_BLOCK_KINDS,
  type PlanBlockKind,
} from "@re-cinq/planning-document";

import { PROSE_BLOCK_SPECS } from "./prose-specs.js";

type HeadlessConfig = BlockConfig<string, PropSchema, "inline" | "none">;

// Never mounted: the headless schema only has to produce the same ProseMirror nodes as the editor's.
const render = () => {
  const dom = document.createElement("div");

  return { dom, contentDOM: dom };
};

const headlessSpec = (kind: PlanBlockKind) =>
  createBlockSpec(PLAN_BLOCK_CONFIGS[kind] as HeadlessConfig, { render })();

export const headlessPlanSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...PROSE_BLOCK_SPECS,
    ...Object.fromEntries(
      PLAN_BLOCK_KINDS.map((kind) => [kind, headlessSpec(kind)]),
    ),
  },
});
