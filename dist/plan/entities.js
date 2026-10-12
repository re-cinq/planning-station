import { z } from "zod";
import { KPI_DIRECTIONS, PROTOTYPE_MATURITIES, } from "../blocks/plan-block-configs.js";
export const kpiSchema = z.object({
    id: z.string(),
    metric: z.string(),
    baseline: z.string(),
    target: z.string(),
    direction: z.enum(KPI_DIRECTIONS),
    deadline: z.string(),
    rationale: z.string(),
});
export const prototypeDeclarationSchema = z.object({
    maturity: z.enum(PROTOTYPE_MATURITIES),
    url: z.string(),
    agreedBy: z.string(),
    notes: z.string(),
});
//# sourceMappingURL=entities.js.map