import { type BlockJson } from "../blocks/block-json.js";
import { type LineChange } from "../lib/diff-lines.js";
import type { ProposedRefine } from "./refine-proposal.js";
export interface ProposalPreview {
    lines: LineChange[];
    /** The section changed after the refine was asked for, so the proposal is out of date. */
    stale: boolean;
}
/** What accepting the proposal would do to its section, line by line. */
export declare function previewProposal(blocks: readonly BlockJson[], proposal: ProposedRefine): ProposalPreview;
//# sourceMappingURL=proposal-preview.d.ts.map