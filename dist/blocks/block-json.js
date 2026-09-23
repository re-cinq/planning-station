import { z } from "zod";
import { planBlockSchema, isPlanBlockKind, } from "./plan-blocks.js";
import { proseBlockSchema } from "./prose-blocks.js";
export function blocksOfType(blocks, type) {
    return blocks.filter((block) => block.type === type);
}
export const blockJsonSchema = z.custom((value) => schemaFor(value).safeParse(value).success, { message: "not a plan block or an allowed prose block" });
export function parseBlock(value) {
    return schemaFor(value).parse(value);
}
export function isPlanBlock(block) {
    return isPlanBlockKind(block.type);
}
function schemaFor(value) {
    const type = value?.type;
    return typeof type === "string" && isPlanBlockKind(type)
        ? planBlockSchema
        : proseBlockSchema;
}
//# sourceMappingURL=block-json.js.map