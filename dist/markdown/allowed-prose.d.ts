import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { AgentOp } from "../ops/agent-ops.js";
import { type ProseInput } from "../ops/prose-input.js";
import type { SectionSlot } from "../template/template.js";
import type { MarkdownProblem } from "./markdown-outcome.js";
/** Both sides of a section's prose, with what its slot has no place for taken out before they are compared. */
export interface JudgedProse {
    live: ProseBlock[];
    written: ProseInput[];
    problems: MarkdownProblem[];
}
/** A pass never writes what validation would flag, and never touches what a person already wrote. A refused block the pass repeats as it stands is the person's and is compared as unchanged, so what the pass adds beside it anchors to it; one the pass left out leaves the comparison, so it is never removed; one the pass wrote itself is dropped and reported. A section with no known slot is compared whole. */
export declare function judgeProse(slot: SectionSlot | undefined, live: ProseBlock[], written: ProseInput[]): JudgedProse;
/** The diff's ops, held to the same rule: a copy or a move of a person's refused block pairs as a new insert, so no op may add a refused block or take away one a person wrote. */
export declare function guardOps(ops: readonly AgentOp[], slot: SectionSlot | undefined, live: readonly ProseBlock[]): {
    ops: AgentOp[];
    problems: MarkdownProblem[];
};
//# sourceMappingURL=allowed-prose.d.ts.map