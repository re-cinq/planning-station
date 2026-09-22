import { z } from "zod";
export declare const kpiInputSchema: z.ZodObject<{
    kpiId: z.ZodString;
    metric: z.ZodString;
    baseline: z.ZodDefault<z.ZodString>;
    target: z.ZodDefault<z.ZodString>;
    direction: z.ZodDefault<z.ZodEnum<{
        up: "up";
        down: "down";
        hold: "hold";
    }>>;
    deadline: z.ZodDefault<z.ZodString>;
    rationale: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const prototypeInputSchema: z.ZodObject<{
    maturity: z.ZodEnum<{
        none: "none";
        "click-dummy": "click-dummy";
        "running-prototype": "running-prototype";
        "pre-prod": "pre-prod";
    }>;
    url: z.ZodDefault<z.ZodString>;
    agreedBy: z.ZodDefault<z.ZodString>;
    notes: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const questionInputSchema: z.ZodObject<{
    slot: z.ZodString;
    questionId: z.ZodString;
    question: z.ZodString;
    why: z.ZodDefault<z.ZodString>;
    kind: z.ZodDefault<z.ZodEnum<{
        text: "text";
        choice: "choice";
    }>>;
    options: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/** What the planning agent writes: semantic, id-stable edits of a section. */
export declare const agentOpSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"set-section-text">;
    slot: z.ZodString;
    paragraphs: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"set-section-prose">;
    slot: z.ZodString;
    blocks: z.ZodArray<z.ZodType<import("./prose-input.js").ProseInput, unknown, z.core.$ZodTypeInternals<import("./prose-input.js").ProseInput, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"append-to-section">;
    slot: z.ZodString;
    paragraphs: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"upsert-kpi">;
    kpi: z.ZodObject<{
        kpiId: z.ZodString;
        metric: z.ZodString;
        baseline: z.ZodDefault<z.ZodString>;
        target: z.ZodDefault<z.ZodString>;
        direction: z.ZodDefault<z.ZodEnum<{
            up: "up";
            down: "down";
            hold: "hold";
        }>>;
        deadline: z.ZodDefault<z.ZodString>;
        rationale: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"set-prototype">;
    prototype: z.ZodObject<{
        maturity: z.ZodEnum<{
            none: "none";
            "click-dummy": "click-dummy";
            "running-prototype": "running-prototype";
            "pre-prod": "pre-prod";
        }>;
        url: z.ZodDefault<z.ZodString>;
        agreedBy: z.ZodDefault<z.ZodString>;
        notes: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add-section">;
    slot: z.ZodString;
    title: z.ZodString;
    after: z.ZodString;
    paragraphs: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"set-section-title">;
    slot: z.ZodString;
    title: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    slot: z.ZodString;
    questionId: z.ZodString;
    question: z.ZodString;
    why: z.ZodDefault<z.ZodString>;
    kind: z.ZodDefault<z.ZodEnum<{
        text: "text";
        choice: "choice";
    }>>;
    options: z.ZodDefault<z.ZodArray<z.ZodString>>;
    op: z.ZodLiteral<"add-question">;
}, z.core.$strip>], "op">;
export declare const agentOpsSchema: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"set-section-text">;
    slot: z.ZodString;
    paragraphs: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"set-section-prose">;
    slot: z.ZodString;
    blocks: z.ZodArray<z.ZodType<import("./prose-input.js").ProseInput, unknown, z.core.$ZodTypeInternals<import("./prose-input.js").ProseInput, unknown>>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"append-to-section">;
    slot: z.ZodString;
    paragraphs: z.ZodArray<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"upsert-kpi">;
    kpi: z.ZodObject<{
        kpiId: z.ZodString;
        metric: z.ZodString;
        baseline: z.ZodDefault<z.ZodString>;
        target: z.ZodDefault<z.ZodString>;
        direction: z.ZodDefault<z.ZodEnum<{
            up: "up";
            down: "down";
            hold: "hold";
        }>>;
        deadline: z.ZodDefault<z.ZodString>;
        rationale: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"set-prototype">;
    prototype: z.ZodObject<{
        maturity: z.ZodEnum<{
            none: "none";
            "click-dummy": "click-dummy";
            "running-prototype": "running-prototype";
            "pre-prod": "pre-prod";
        }>;
        url: z.ZodDefault<z.ZodString>;
        agreedBy: z.ZodDefault<z.ZodString>;
        notes: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add-section">;
    slot: z.ZodString;
    title: z.ZodString;
    after: z.ZodString;
    paragraphs: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"set-section-title">;
    slot: z.ZodString;
    title: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    slot: z.ZodString;
    questionId: z.ZodString;
    question: z.ZodString;
    why: z.ZodDefault<z.ZodString>;
    kind: z.ZodDefault<z.ZodEnum<{
        text: "text";
        choice: "choice";
    }>>;
    options: z.ZodDefault<z.ZodArray<z.ZodString>>;
    op: z.ZodLiteral<"add-question">;
}, z.core.$strip>], "op">>;
export type KpiInput = z.infer<typeof kpiInputSchema>;
export type PrototypeInput = z.infer<typeof prototypeInputSchema>;
export type QuestionInput = z.infer<typeof questionInputSchema>;
export type AgentOp = z.infer<typeof agentOpSchema>;
//# sourceMappingURL=agent-ops.d.ts.map