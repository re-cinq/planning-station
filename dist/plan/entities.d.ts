import { z } from "zod";
export declare const kpiSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const prototypeDeclarationSchema: z.ZodObject<{
    maturity: z.ZodEnum<{
        none: "none";
        "click-dummy": "click-dummy";
        "running-prototype": "running-prototype";
        "pre-prod": "pre-prod";
    }>;
    url: z.ZodString;
    agreedBy: z.ZodString;
    notes: z.ZodString;
}, z.core.$strip>;
export type Kpi = z.infer<typeof kpiSchema>;
export type PrototypeDeclaration = z.infer<typeof prototypeDeclarationSchema>;
//# sourceMappingURL=entities.d.ts.map