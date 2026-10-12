import { blocksOfType } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { isAtLeast } from "./problems.js";
/** A blocker finding the review raised holds approval until someone resolves it; a warning is advice, and advice never holds a plan. */
export const unresolvedFindings = ({ plan: { sections }, phase }) => isAtLeast(phase, "approval") ? sections.flatMap(unresolvedIn) : [];
function unresolvedIn({ slot, blocks }) {
    return blocksOfType(blocks, "finding")
        .filter((finding) => !finding.props.resolved)
        .filter((finding) => finding.props.severity === "blocker")
        .map((finding) => ({
        code: "unresolved-finding",
        slot,
        blockId: finding.id,
        message: `finding "${plainText(finding.content)}" is unresolved`,
    }));
}
//# sourceMappingURL=finding-check.js.map