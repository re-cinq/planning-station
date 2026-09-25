import { z } from "zod";
export declare const PLAN_KINDS: readonly ["feature", "ui-change", "performance", "refactor", "incident-response"];
export declare const PLAN_STATUSES: readonly ["draft", "in-review", "approved", "superseded"];
export declare const planKindSchema: z.ZodEnum<{
    feature: "feature";
    "ui-change": "ui-change";
    performance: "performance";
    refactor: "refactor";
    "incident-response": "incident-response";
}>;
export declare const planStatusSchema: z.ZodEnum<{
    draft: "draft";
    "in-review": "in-review";
    approved: "approved";
    superseded: "superseded";
}>;
export declare const approvalModeSchema: z.ZodEnum<{
    manual: "manual";
    automatic: "automatic";
}>;
export declare const approvalSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        manual: "manual";
        automatic: "automatic";
    }>;
    approvedBy: z.ZodString;
    approvedAt: z.ZodISODateTime;
    version: z.ZodNumber;
}, z.core.$strip>;
export declare const REPO_PATTERN: RegExp;
export declare const planMetaSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type PlanKind = z.infer<typeof planKindSchema>;
export type PlanStatus = z.infer<typeof planStatusSchema>;
export type Approval = z.infer<typeof approvalSchema>;
export type PlanMeta = z.infer<typeof planMetaSchema>;
//# sourceMappingURL=plan-meta.d.ts.map