import { z } from "zod";
import { inlineContentSchema } from "./inline-text.js";
import { PLAN_BLOCK_CONFIGS, PLAN_BLOCK_KINDS, } from "./plan-block-configs.js";
export function propZod(spec) {
    if (spec.values) {
        return z
            .enum([...spec.values])
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
export function isPlanBlockKind(type) {
    return type in PLAN_BLOCK_CONFIGS;
}
export const PLAN_BLOCK_SCHEMAS = Object.fromEntries(PLAN_BLOCK_KINDS.map((type) => [type, blockZod(type)]));
export const planBlockSchema = z.discriminatedUnion("type", PLAN_BLOCK_KINDS.map((type) => PLAN_BLOCK_SCHEMAS[type]));
function blockZod(type) {
    const config = PLAN_BLOCK_CONFIGS[type];
    const props = Object.fromEntries(Object.entries(config.propSchema).map(([name, spec]) => [
        name,
        propZod(spec),
    ]));
    return z.object({
        id: z.string(),
        type: z.literal(type),
        props: z.object(props),
        content: contentZod(config.content),
        children: z.array(z.never()).default([]),
    });
}
function contentZod(content) {
    return content === "inline"
        ? inlineContentSchema.default([])
        : z.array(z.never()).default([]);
}
//# sourceMappingURL=plan-blocks.js.map