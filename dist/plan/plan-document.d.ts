import { z } from "zod";
export declare const sectionSchema: z.ZodObject<{
    headingId: z.ZodString;
    slot: z.ZodString;
    title: z.ZodString;
    blocks: z.ZodArray<z.ZodType<import("../blocks/block-json.js").BlockJson, unknown, z.core.$ZodTypeInternals<import("../blocks/block-json.js").BlockJson, unknown>>>;
}, z.core.$strip>;
export declare const derivedViewsSchema: z.ZodObject<{
    kpis: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        metric: z.ZodString;
        baseline: z.ZodString;
        target: z.ZodString;
        direction: z.ZodEnum<{
            up: "up";
            down: "down";
            hold: "hold";
        }>;
        deadline: z.ZodString;
        rationale: z.ZodString;
    }, z.core.$strip>>;
    prototype: z.ZodNullable<z.ZodObject<{
        maturity: z.ZodEnum<{
            none: "none";
            "click-dummy": "click-dummy";
            "running-prototype": "running-prototype";
            "pre-prod": "pre-prod";
        }>;
        url: z.ZodString;
        agreedBy: z.ZodString;
        notes: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const planDocumentSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    id: z.ZodString;
    repo: z.ZodString;
    type: z.ZodEnum<{
        feature: "feature";
        "ui-change": "ui-change";
        performance: "performance";
        refactor: "refactor";
        "incident-response": "incident-response";
    }>;
    templateVersion: z.ZodNumber;
    title: z.ZodString;
    status: z.ZodEnum<{
        draft: "draft";
        "in-review": "in-review";
        approved: "approved";
        superseded: "superseded";
    }>;
    approval: z.ZodNullable<z.ZodObject<{
        mode: z.ZodEnum<{
            manual: "manual";
            automatic: "automatic";
        }>;
        approvedBy: z.ZodString;
        approvedAt: z.ZodISODateTime;
        version: z.ZodNumber;
    }, z.core.$strip>>;
    version: z.ZodNumber;
    createdBy: z.ZodString;
    updatedAt: z.ZodISODateTime;
    sections: z.ZodArray<z.ZodObject<{
        headingId: z.ZodString;
        slot: z.ZodString;
        title: z.ZodString;
        blocks: z.ZodArray<z.ZodType<import("../blocks/block-json.js").BlockJson, unknown, z.core.$ZodTypeInternals<import("../blocks/block-json.js").BlockJson, unknown>>>;
    }, z.core.$strip>>;
    kpis: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        metric: z.ZodString;
        baseline: z.ZodString;
        target: z.ZodString;
        direction: z.ZodEnum<{
            up: "up";
            down: "down";
            hold: "hold";
        }>;
        deadline: z.ZodString;
        rationale: z.ZodString;
    }, z.core.$strip>>;
    prototype: z.ZodNullable<z.ZodObject<{
        maturity: z.ZodEnum<{
            none: "none";
            "click-dummy": "click-dummy";
            "running-prototype": "running-prototype";
            "pre-prod": "pre-prod";
        }>;
        url: z.ZodString;
        agreedBy: z.ZodString;
        notes: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Section = z.infer<typeof sectionSchema>;
export type DerivedViews = z.infer<typeof derivedViewsSchema>;
export type PlanDocument = z.infer<typeof planDocumentSchema>;
//# sourceMappingURL=plan-document.d.ts.map