export { PROSE_BLOCK_SPECS } from "./schema/prose-specs.js";
export { headlessPlanSchema } from "./schema/headless-schema.js";
export { docFromBlocks, readBlocks, seedDoc, SeededDocError, } from "./convert/plan-doc.js";
export { applyOpsToDoc, rewriteDoc, UnseededDocError, } from "./convert/apply-ops.js";
export { acceptRefine, applyRefineAnyway, askRefine, discardRefine, enforceSectionUnchanged, failRefine, NoProposalError, PROPOSALS, proposalsIn, proposePass, proposeRefine, } from "./refine/proposals.js";
export { acceptChange, applyChangeAnyway, changesIn, CHANGES, discardChange, discardChangesIn, NoChangeError, proposeChanges, staleChanges, } from "./refine/changes.js";
export { fromBase64, toBase64 } from "./wire/base64.js";
//# sourceMappingURL=index.js.map