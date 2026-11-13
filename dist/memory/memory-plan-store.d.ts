import type { PlanStore } from "../ports/plan-store.js";
export declare class UnknownPlanError extends Error {
}
/** A PlanStore that keeps everything in this process; the PoC and tests use it. */
export declare function createMemoryPlanStore(): PlanStore;
//# sourceMappingURL=memory-plan-store.d.ts.map