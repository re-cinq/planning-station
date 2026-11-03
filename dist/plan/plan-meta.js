import { z } from "zod";
export const PLAN_KINDS = [
    "feature",
    "ui-change",
    "performance",
    "refactor",
    "incident-response",
];
export const PLAN_STATUSES = [
    "draft",
    "in-review",
    "approved",
    "superseded",
];
export const planKindSchema = z.enum(PLAN_KINDS);
export const planStatusSchema = z.enum(PLAN_STATUSES);
export const approvalModeSchema = z.enum(["manual", "automatic"]);
export const approvalSchema = z.object({
    mode: approvalModeSchema,
    approvedBy: z.string().min(1),
    approvedAt: z.iso.datetime(),
    version: z.number().int().positive(),
});
export const REPO_PATTERN = /^[^/\s]+\/[^/\s]+$/;
export const planMetaSchema = z.object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    repo: z.string().regex(REPO_PATTERN),
    type: planKindSchema,
    templateVersion: z.number().int().positive(),
    title: z.string().min(1),
    status: planStatusSchema,
    approval: approvalSchema.nullable(),
    version: z.number().int().nonnegative(),
    createdBy: z.string().min(1),
    updatedAt: z.iso.datetime(),
});
//# sourceMappingURL=plan-meta.js.map