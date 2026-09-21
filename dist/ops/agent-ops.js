import { z } from "zod";
import { KPI_DIRECTIONS, PROTOTYPE_MATURITIES, } from "../blocks/plan-block-configs.js";
export const kpiInputSchema = z.object({
    kpiId: z.string().min(1),
    metric: z.string().min(1),
    baseline: z.string().default(""),
    target: z.string().default(""),
    direction: z.enum(KPI_DIRECTIONS).default("down"),
    deadline: z.string().default(""),
    rationale: z.string().default(""),
});
export const prototypeInputSchema = z.object({
    maturity: z.enum(PROTOTYPE_MATURITIES),
    url: z.string().default(""),
    agreedBy: z.string().default(""),
    notes: z.string().default(""),
});
/** What the planning agent writes: semantic, id-stable edits of a section. */
export const agentOpSchema = z.discriminatedUnion("op", [
    z.object({
        op: z.literal("set-section-text"),
        slot: z.string().min(1),
        paragraphs: z.array(z.string()),
    }),
    z.object({
        op: z.literal("append-to-section"),
        slot: z.string().min(1),
        paragraphs: z.array(z.string()),
    }),
    z.object({ op: z.literal("upsert-kpi"), kpi: kpiInputSchema }),
    z.object({ op: z.literal("set-prototype"), prototype: prototypeInputSchema }),
]);
export const agentOpsSchema = z.array(agentOpSchema);
//# sourceMappingURL=agent-ops.js.map