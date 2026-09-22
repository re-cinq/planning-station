import { type BlockJson } from "../blocks/block-json.js";
import type { PlanTemplate } from "../template/template.js";
/** Prose is flattened to its text, so lists and headings read as paragraphs and a table is left out. */
export declare function planToMarkdown(blocks: readonly BlockJson[], template: PlanTemplate): string;
//# sourceMappingURL=plan-to-markdown.d.ts.map