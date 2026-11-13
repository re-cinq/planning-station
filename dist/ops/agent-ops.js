import { z } from "zod";
import { FINDING_SEVERITIES, KPI_DIRECTIONS, MOCKUP_CAPTION_MAX, MOCKUP_FORMATS, MOCKUP_HEIGHT_DEFAULT, MOCKUP_HEIGHT_MAX, MOCKUP_HEIGHT_MIN, MOCKUP_KINDS, MOCKUP_MARKUP_MAX, PROTOTYPE_MATURITIES, QUESTION_KINDS, } from "../blocks/plan-block-configs.js";
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
const SCRIPT_TAG = /<script/i;
const isSvgWhenSvg = ({ format, markup }) => format !== "svg" || markup.trim().startsWith("<svg");
export const mockupInputSchema = z
    .object({
    mockupId: z.string().regex(/^m-[a-z0-9-]+$/),
    kind: z.enum(MOCKUP_KINDS),
    format: z.enum(MOCKUP_FORMATS),
    caption: z.string().min(1).max(MOCKUP_CAPTION_MAX),
    markup: z
        .string()
        .min(1)
        .max(MOCKUP_MARKUP_MAX)
        .refine((markup) => !SCRIPT_TAG.test(markup), "markup holds a script"),
    height: z
        .number()
        .int()
        .min(MOCKUP_HEIGHT_MIN)
        .max(MOCKUP_HEIGHT_MAX)
        .default(MOCKUP_HEIGHT_DEFAULT),
})
    .refine(isSvgWhenSvg, "svg markup starts with <svg");
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
    z.object({ op: z.literal("add-mockup"), mockup: mockupInputSchema }),
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
    z.object({ op: z.literal("remove-section"), slot: z.string().min(1) }),
    z.object({ op: z.literal("add-question"), ...questionInputSchema.shape }),
    z.object({ op: z.literal("add-finding"), ...findingInputSchema.shape }),
]);
export const agentOpsSchema = z.array(agentOpSchema);
//# sourceMappingURL=agent-ops.js.map