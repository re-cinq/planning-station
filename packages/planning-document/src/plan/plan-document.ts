import { z } from "zod";

import { blockJsonSchema } from "../blocks/block-json.js";
import { kpiSchema, prototypeDeclarationSchema } from "./entities.js";
import { planMetaSchema } from "./plan-meta.js";

export const sectionSchema = z.object({
  headingId: z.string(),
  slot: z.string(),
  title: z.string(),
  blocks: z.array(blockJsonSchema),
});

export const derivedViewsSchema = z.object({
  kpis: z.array(kpiSchema),
  prototype: prototypeDeclarationSchema.nullable(),
});

export const planDocumentSchema = planMetaSchema
  .extend({ sections: z.array(sectionSchema) })
  .extend(derivedViewsSchema.shape);

export type Section = z.infer<typeof sectionSchema>;
export type DerivedViews = z.infer<typeof derivedViewsSchema>;
export type PlanDocument = z.infer<typeof planDocumentSchema>;
