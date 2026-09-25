import { z } from "zod";
import { FINDING_SEVERITIES, KPI_DIRECTIONS, PROTOTYPE_MATURITIES, QUESTION_KINDS, } from "../blocks/plan-block-configs.js";
import { CUSTOM_SLOT_PREFIX } from "../template/templates.js";
import { proseInputSchema } from "./prose-input.js";
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
const customSlotSchema = z.string().startsWith(CUSTOM_SLOT_PREFIX);
export const questionInputSchema = z.object({
    slot: z.string().min(1),
    questionId: z.string().min(1),
    question: z.string().min(1),
    why: z.string().default(""),
    kind: z.enum(QUESTION_KINDS).default("text"),
    options: z.array(z.string()).default([]),
});
export const findingInputSchema = z.object({
    slot: z.string().min(1),
    findingId: z.string().min(1),
    text: z.string().min(1),
    why: z.string().default(""),
    severity: z.enum(FINDING_SEVERITIES).default("warning"),
});
/** What the planning agent writes: semantic, id-stable edits of a section. */
export const agentOpSchema = z.discriminatedUnion("op", [
    z.object({
        op: z.literal("set-section-text"),
        slot: z.string().min(1),
        paragraphs: z.array(z.string()),
    }),
    z.object({
        op: z.literal("set-section-prose"),
        slot: z.string().min(1),
        blocks: z.array(proseInputSchema),
    }),
    z.object({
        op: z.literal("append-to-section"),
        slot: z.string().min(1),
        paragraphs: z.array(z.string()),
    }),
    z.object({
        op: z.literal("replace-block"),
        slot: z.string().min(1),
        blockId: z.string().min(1),
        block: proseInputSchema,
    }),
    z.object({
        op: z.literal("insert-blocks"),
        slot: z.string().min(1),
        /** The block the new ones follow; null puts them at the top of the section. */
        after: z.string().min(1).nullable(),
        blocks: z.array(proseInputSchema),
    }),
    z.object({
        op: z.literal("remove-block"),
        slot: z.string().min(1),
        blockId: z.string().min(1),
    }),
    z.object({ op: z.literal("upsert-kpi"), kpi: kpiInputSchema }),
    z.object({ op: z.literal("set-prototype"), prototype: prototypeInputSchema }),
    z.object({
        op: z.literal("add-section"),
        slot: customSlotSchema,
        title: z.string().min(1),
        after: z.string().min(1),
        paragraphs: z.array(z.string()).default([]),
    }),
    z.object({
        op: z.literal("set-section-title"),
        slot: customSlotSchema,
        title: z.string().min(1),
    }),
    z.object({ op: z.literal("add-question"), ...questionInputSchema.shape }),
    z.object({ op: z.literal("add-finding"), ...findingInputSchema.shape }),
]);
export const agentOpsSchema = z.array(agentOpSchema);
//# sourceMappingURL=agent-ops.js.map