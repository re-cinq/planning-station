import { type BlockJson, type PlanBlockOf } from "../blocks/block-json.js";
import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { KpiInput, PrototypeInput } from "../ops/agent-ops.js";
import type { Section } from "../plan/plan-document.js";
import type { PlanTemplate } from "../template/template.js";
/** A heading's own title wins: templates retitle sections, and the agent titles its own. */
export declare function sectionTitle(section: Section, template: PlanTemplate): string;
export declare function liveProse(section: Section): ProseBlock[];
export declare function kpiInputOf(block: PlanBlockOf<"kpi">): KpiInput;
export declare function prototypeInputOf(block: PlanBlockOf<"prototype">): PrototypeInput;
export declare function liveKpis(blocks: readonly BlockJson[]): ReadonlyMap<string, KpiInput>;
export declare function livePrototype(blocks: readonly BlockJson[]): PrototypeInput | null;
//# sourceMappingURL=live-section.d.ts.map