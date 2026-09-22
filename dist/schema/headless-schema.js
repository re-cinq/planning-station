import { BlockNoteSchema, createBlockSpec, } from "@blocknote/core";
import { PLAN_BLOCK_CONFIGS, PLAN_BLOCK_KINDS, } from "@re-cinq/planning-document";
import { PROSE_BLOCK_SPECS } from "./prose-specs.js";
// Never mounted: the headless schema only has to produce the same ProseMirror nodes as the editor's.
const render = () => {
    const dom = document.createElement("div");
    return { dom, contentDOM: dom };
};
const headlessSpec = (kind) => createBlockSpec(PLAN_BLOCK_CONFIGS[kind], { render })();
export const headlessPlanSchema = BlockNoteSchema.create({
    blockSpecs: {
        ...PROSE_BLOCK_SPECS,
        ...Object.fromEntries(PLAN_BLOCK_KINDS.map((kind) => [kind, headlessSpec(kind)])),
    },
});
//# sourceMappingURL=headless-schema.js.map