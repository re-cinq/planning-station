import { z } from "zod";

import { inlineContentSchema, type InlineContent } from "./inline-text.js";
import {
  PLAN_BLOCK_CONFIGS,
  PLAN_BLOCK_KINDS,
  type PlanBlockConfigs,
  type PlanBlockKind,
} from "./plan-block-configs.js";

type PropSpec = {
  default: string | number | boolean;
  values?: readonly string[];
};

type PropValue<P> = P extends { values: readonly (infer V)[] }
  ? V
  : P extends { default: infer D }
    ? Widened<D>
    : never;

type Widened<D> = D extends string
  ? string
  : D extends boolean
    ? boolean
    : D extends number
      ? number
      : D;

type PropsOf<C> = C extends { propSchema: infer P }
  ? { [K in keyof P]: PropValue<P[K]> }
  : never;

type BlockOf<K extends PlanBlockKind> = {
  id: string;
  type: K;
  props: PropsOf<PlanBlockConfigs[K]>;
  content: InlineContent;
  children: never[];
};

export type PlanBlock = { [K in PlanBlockKind]: BlockOf<K> }[PlanBlockKind];

export function propZod(spec: PropSpec): z.ZodTypeAny {
  if (spec.values) {
    return z
      .enum([...spec.values] as [string, ...string[]])
      .default(String(spec.default));
  }

  if (typeof spec.default === "boolean") {
    return z.boolean().default(spec.default);
  }

  if (typeof spec.default === "number") {
    return z.number().default(spec.default);
  }

  return z.string().default(spec.default);
}

export function isPlanBlockKind(type: string): type is PlanBlockKind {
  return type in PLAN_BLOCK_CONFIGS;
}

export const PLAN_BLOCK_SCHEMAS = Object.fromEntries(
  PLAN_BLOCK_KINDS.map((type) => [type, blockZod(type)]),
) as Record<PlanBlockKind, z.ZodTypeAny>;

export const planBlockSchema = z.discriminatedUnion(
  "type",
  PLAN_BLOCK_KINDS.map((type) => PLAN_BLOCK_SCHEMAS[type]) as never,
) as unknown as z.ZodType<PlanBlock>;

function blockZod(type: PlanBlockKind): z.ZodTypeAny {
  const config = PLAN_BLOCK_CONFIGS[type];
  const props = Object.fromEntries(
    Object.entries(config.propSchema).map(([name, spec]) => [
      name,
      propZod(spec as PropSpec),
    ]),
  );

  return z.object({
    id: z.string(),
    type: z.literal(type),
    props: z.object(props),
    content: contentZod(config.content),
    children: z.array(z.never()).default([]),
  });
}

function contentZod(content: "inline" | "none"): z.ZodTypeAny {
  return content === "inline"
    ? inlineContentSchema.default([])
    : z.array(z.never()).default([]);
}
