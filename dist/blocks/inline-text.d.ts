import { z } from "zod";
export declare const styledTextSchema: z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    styles: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>>;
}, z.core.$strip>;
export declare const linkSchema: z.ZodObject<{
    type: z.ZodLiteral<"link">;
    href: z.ZodString;
    content: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        styles: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const inlineContentSchema: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    styles: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"link">;
    href: z.ZodString;
    content: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        styles: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>>;
    }, z.core.$strip>>;
}, z.core.$strip>], "type">>;
export type InlineContent = z.infer<typeof inlineContentSchema>;
export declare function plainText(content: InlineContent): string;
export declare function inlineFromText(text: string): InlineContent;
//# sourceMappingURL=inline-text.d.ts.map