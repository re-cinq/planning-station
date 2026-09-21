import { BlockNoteEditor, type Block } from "@blocknote/core";
import {
  blocksToYXmlFragment,
  yXmlFragmentToBlocks,
} from "@blocknote/core/yjs";
import {
  enforceTrue,
  parseBlock,
  PLAN_FRAGMENT,
  type BlockJson,
} from "@re-cinq/planning-document";
import { Doc } from "yjs";

import { headlessPlanSchema } from "../schema/headless-schema.js";

export class SeededDocError extends Error {}

let converter: BlockNoteEditor | undefined;

export function seedDoc(doc: Doc, blocks: readonly BlockJson[]): Doc {
  const fragment = doc.getXmlFragment(PLAN_FRAGMENT);
  enforceTrue(
    fragment.length === 0,
    SeededDocError,
    "a plan document is seeded once; this one already has content",
  );
  blocksToYXmlFragment(headless(), blocks as unknown as Block[], fragment);

  return doc;
}

export function docFromBlocks(blocks: readonly BlockJson[]): Doc {
  return seedDoc(new Doc(), blocks);
}

export function readBlocks(doc: Doc): BlockJson[] {
  return yXmlFragmentToBlocks(
    headless(),
    doc.getXmlFragment(PLAN_FRAGMENT),
  ).map(parseBlock);
}

export function headlessConverter(): BlockNoteEditor {
  return headless();
}

function headless(): BlockNoteEditor {
  converter ??= BlockNoteEditor.create({
    schema: headlessPlanSchema,
  }) as unknown as BlockNoteEditor;

  return converter;
}
