import { BlockNoteEditor } from "@blocknote/core";
import { type BlockJson } from "@re-cinq/planning-document";
import { Doc } from "yjs";
export declare class SeededDocError extends Error {
}
export declare function seedDoc(doc: Doc, blocks: readonly BlockJson[]): Doc;
export declare function docFromBlocks(blocks: readonly BlockJson[]): Doc;
export declare function readBlocks(doc: Doc): BlockJson[];
export declare function headlessConverter(): BlockNoteEditor;
//# sourceMappingURL=plan-doc.d.ts.map