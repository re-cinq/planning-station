import { type BlockJson } from "../blocks/block-json.js";
import type { PlanDocument } from "../plan/plan-document.js";
export declare function toBlocks(plan: Pick<PlanDocument, "sections"> & Partial<Pick<PlanDocument, "title">>): BlockJson[];
//# sourceMappingURL=to-blocks.d.ts.map