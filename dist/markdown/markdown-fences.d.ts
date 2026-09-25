import { type KpiInput, type PrototypeInput } from "../ops/agent-ops.js";
import { type MarkdownOps } from "./markdown-outcome.js";
import type { Fence } from "./read-markdown.js";
/** What the plan holds now, for telling a changed fence from one written back as it was. */
export interface LiveEntities {
    kpis: ReadonlyMap<string, KpiInput>;
    prototype: PrototypeInput | null;
}
export declare function fenceOps(fence: Fence, slot: string, live: LiveEntities): MarkdownOps;
//# sourceMappingURL=markdown-fences.d.ts.map