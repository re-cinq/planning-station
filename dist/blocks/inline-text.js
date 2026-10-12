import { z } from "zod";
export const styledTextSchema = z.object({
    type: z.literal("text"),
    text: z.string(),
    styles: z.record(z.string(), z.union([z.boolean(), z.string()])).default({}),
});
export const linkSchema = z.object({
    type: z.literal("link"),
    href: z.string(),
    content: z.array(styledTextSchema),
});
export const inlineContentSchema = z.array(z.discriminatedUnion("type", [styledTextSchema, linkSchema]));
export function plainText(content) {
    return content.map(textOf).join("");
}
export function inlineFromText(text) {
    if (text === "") {
        return [];
    }
    return [{ type: "text", text, styles: {} }];
}
function textOf(node) {
    return node.type === "text" ? node.text : plainText(node.content);
}
//# sourceMappingURL=inline-text.js.map