import { z } from "zod";
import { type AgentOp } from "../ops/agent-ops.js";
export declare const refineUsesSchema: z.ZodObject<{
    questions: z.ZodDefault<z.ZodArray<z.ZodString>>;
    comments: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const proposedSchema: z.ZodObject<{
    slot: z.ZodString;
    baseHash: z.ZodString;
    askedBy: z.ZodString;
    askedAt: z.ZodString;
    status: z.ZodLiteral<"proposed">;
    ops: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        op: z.ZodLiteral<"set-section-text">;
        slot: z.ZodString;
        paragraphs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"append-to-section">;
        slot: z.ZodString;
        paragraphs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"upsert-kpi">;
        kpi: z.ZodObject<{
            kpiId: z.ZodString;
            metric: z.ZodString;
            baseline: z.ZodDefault<z.ZodString>;
            target: z.ZodDefault<z.ZodString>;
            direction: z.ZodDefault<z.ZodEnum<{
                up: "up";
                down: "down";
                hold: "hold";
            }>>;
            deadline: z.ZodDefault<z.ZodString>;
            rationale: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"set-prototype">;
        prototype: z.ZodObject<{
            maturity: z.ZodEnum<{
                none: "none";
                "click-dummy": "click-dummy";
                "running-prototype": "running-prototype";
                "pre-prod": "pre-prod";
            }>;
            url: z.ZodDefault<z.ZodString>;
            agreedBy: z.ZodDefault<z.ZodString>;
            notes: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>], "op">>;
    uses: z.ZodObject<{
        questions: z.ZodDefault<z.ZodArray<z.ZodString>>;
        comments: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    proposedBy: z.ZodString;
    proposedAt: z.ZodString;
}, z.core.$strip>;
/** One section's refine: asked for by a person, then proposed by the agent, until someone accepts or discards it. */
export declare const refineProposalSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    status: z.ZodLiteral<"asked">;
    slot: z.ZodString;
    baseHash: z.ZodString;
    askedBy: z.ZodString;
    askedAt: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    slot: z.ZodString;
    baseHash: z.ZodString;
    askedBy: z.ZodString;
    askedAt: z.ZodString;
    status: z.ZodLiteral<"proposed">;
    ops: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        op: z.ZodLiteral<"set-section-text">;
        slot: z.ZodString;
        paragraphs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"append-to-section">;
        slot: z.ZodString;
        paragraphs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"upsert-kpi">;
        kpi: z.ZodObject<{
            kpiId: z.ZodString;
            metric: z.ZodString;
            baseline: z.ZodDefault<z.ZodString>;
            target: z.ZodDefault<z.ZodString>;
            direction: z.ZodDefault<z.ZodEnum<{
                up: "up";
                down: "down";
                hold: "hold";
            }>>;
            deadline: z.ZodDefault<z.ZodString>;
            rationale: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"set-prototype">;
        prototype: z.ZodObject<{
            maturity: z.ZodEnum<{
                none: "none";
                "click-dummy": "click-dummy";
                "running-prototype": "running-prototype";
                "pre-prod": "pre-prod";
            }>;
            url: z.ZodDefault<z.ZodString>;
            agreedBy: z.ZodDefault<z.ZodString>;
            notes: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>], "op">>;
    uses: z.ZodObject<{
        questions: z.ZodDefault<z.ZodArray<z.ZodString>>;
        comments: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    proposedBy: z.ZodString;
    proposedAt: z.ZodString;
}, z.core.$strip>], "status">;
export type RefineUses = z.infer<typeof refineUsesSchema>;
export type RefineProposal = z.infer<typeof refineProposalSchema>;
export type ProposedRefine = z.infer<typeof proposedSchema>;
export declare class ProposalScopeError extends Error {
}
/** A refine answers for one section, so every op it carries must stay inside it. */
export declare function enforceInSection(slot: string, ops: readonly AgentOp[]): void;
export {};
//# sourceMappingURL=refine-proposal.d.ts.map