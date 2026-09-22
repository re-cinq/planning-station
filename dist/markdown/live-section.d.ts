import { type BlockJson, type PlanBlockOf } from "../blocks/block-json.js";
import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { KpiInput, PrototypeInput } from "../ops/agent-ops.js";
import type { Section } from "../plan/plan-document.js";
import type { PlanTemplate } from "../template/template.js";
/** A heading's own title wins: templates retitle sections, and the agent titles its own. */
export declare function sectionTitle(section: Section, template: PlanTemplate): string;
/** A prose block and its nested blocks flattened to their text, one entry each; a table has none. */
export declare function proseTexts(block: ProseBlock): string[];
/** What a section's prose reads as once written out and read back. */
export declare function proseParagraphs(section: Section): string[];
export declare function kpiInputOf(block: PlanBlockOf<"kpi">): KpiInput;
export declare function prototypeInputOf(block: PlanBlockOf<"prototype">): PrototypeInput;
export declare function liveKpis(blocks: readonly BlockJson[]): ReadonlyMap<string, KpiInput>;
export declare function livePrototype(blocks: readonly BlockJson[]): PrototypeInput | null;
//# sourceMappingURL=live-section.d.ts.map