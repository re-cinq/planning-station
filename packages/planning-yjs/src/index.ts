export { PROSE_BLOCK_SPECS } from "./schema/prose-specs.js";
export { headlessPlanSchema } from "./schema/headless-schema.js";
export {
  docFromBlocks,
  readBlocks,
  seedDoc,
  SeededDocError,
} from "./convert/plan-doc.js";
export {
  applyOpsToDoc,
  rewriteDoc,
  UnseededDocError,
  type BlocksChange,
} from "./convert/apply-ops.js";
export {
  acceptRefine,
  applyRefineAnyway,
  askRefine,
  discardRefine,
  enforceSectionUnchanged,
  NoProposalError,
  PROPOSALS,
  proposalsIn,
  proposePass,
  proposeRefine,
  type PassOffer,
  type PassOutcome,
  type RefineAsk,
  type RefineOffer,
  type SectionBase,
} from "./refine/proposals.js";
export { fromBase64, toBase64 } from "./wire/base64.js";
