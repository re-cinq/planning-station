import { z } from "zod";
import { type InlineContent } from "./inline-text.js";
import { type PlanBlockConfigs, type PlanBlockKind } from "./plan-block-configs.js";
type PropSpec = {
    default: string | number | boolean;
    values?: readonly string[];
};
type PropValue<P> = P extends {
    values: readonly (infer V)[];
} ? V : P extends {
    default: infer D;
} ? Widened<D> : never;
type Widened<D> = D extends string ? string : D extends boolean ? boolean : D extends number ? number : D;
type PropsOf<C> = C extends {
    propSchema: infer P;
} ? {
    [K in keyof P]: PropValue<P[K]>;
} : never;
type BlockOf<K extends PlanBlockKind> = {
    id: string;
    type: K;
    props: PropsOf<PlanBlockConfigs[K]>;
    content: InlineContent;
    children: never[];
};
export type PlanBlock = {
    [K in PlanBlockKind]: BlockOf<K>;
}[PlanBlockKind];
export declare function propZod(spec: PropSpec): z.ZodTypeAny;
export declare function isPlanBlockKind(type: string): type is PlanBlockKind;
export declare const PLAN_BLOCK_SCHEMAS: Record<PlanBlockKind, z.ZodTypeAny>;
export declare const planBlockSchema: z.ZodType<PlanBlock>;
export {};
//# sourceMappingURL=plan-blocks.d.ts.map