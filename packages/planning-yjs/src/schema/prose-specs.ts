import { createHeadingBlockSpec, defaultBlockSpecs } from "@blocknote/core";
import { PROSE_HEADING_LEVELS } from "@re-cinq/planning-document";

const {
  paragraph,
  bulletListItem,
  numberedListItem,
  checkListItem,
  quote,
  codeBlock,
  table,
} = defaultBlockSpecs;

export const PROSE_BLOCK_SPECS = {
  paragraph,
  heading: createHeadingBlockSpec({
    defaultLevel: 2,
    levels: PROSE_HEADING_LEVELS,
    allowToggleHeadings: false,
  }),
  bulletListItem,
  numberedListItem,
  checkListItem,
  quote,
  codeBlock,
  table,
};
