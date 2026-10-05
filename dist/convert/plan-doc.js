import { BlockNoteEditor } from "@blocknote/core";
import { blocksToYXmlFragment, yXmlFragmentToBlocks, } from "@blocknote/core/yjs";
import { enforceTrue, parseBlock, PLAN_FRAGMENT, } from "@re-cinq/planning-document";
import { Doc } from "yjs";
import { headlessPlanSchema } from "../schema/headless-schema.js";
export class SeededDocError extends Error {
}
let converter;
export function seedDoc(doc, blocks) {
    const fragment = doc.getXmlFragment(PLAN_FRAGMENT);
    enforceTrue(fragment.length === 0, SeededDocError, "a plan document is seeded once; this one already has content");
    blocksToYXmlFragment(headless(), blocks, fragment);
    return doc;
}
export function docFromBlocks(blocks) {
    return seedDoc(new Doc(), blocks);
}
export function readBlocks(doc) {
    return yXmlFragmentToBlocks(headless(), doc.getXmlFragment(PLAN_FRAGMENT)).map(parseBlock);
}
export function headlessConverter() {
    return headless();
}
function headless() {
    converter ??= BlockNoteEditor.create({
        schema: headlessPlanSchema,
    });
    return converter;
}
//# sourceMappingURL=plan-doc.js.map