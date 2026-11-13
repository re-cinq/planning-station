import type { BlockJson } from "../blocks/block-json.js";
import type { PlanTemplate } from "../template/template.js";
import { type MarkdownOps } from "./markdown-outcome.js";
/** Only what the agent changed becomes an op; a section left out of the file is left alone. */
export declare function markdownToOps(markdown: string, blocks: readonly BlockJson[], template: PlanTemplate): MarkdownOps;
//# sourceMappingURL=markdown-to-ops.d.ts.map