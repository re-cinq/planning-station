import { z } from "zod";
import type { BlockJson } from "../blocks/block-json.js";
import { type AgentOp } from "../ops/agent-ops.js";
import type { ProseInput } from "../ops/prose-input.js";
import { type RefineUses } from "./refine-proposal.js";
/** One change a pass proposes, about ONE block: reviewed, accepted and refused on its own, where it lands. */
export declare const planChangeSchema: z.ZodObject<{
    changeId: z.ZodString;
    slot: z.ZodString;
    anchorId: z.ZodNullable<z.ZodString>;
    baseHash: z.ZodString;
    op: z.ZodDiscriminatedUnion<[z.ZodObject<{
        op: z.ZodLiteral<"set-section-text">;
        slot: z.ZodString;
        paragraphs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"set-section-prose">;
        slot: z.ZodString;
        blocks: z.ZodArray<z.ZodType<ProseInput, unknown, z.core.$ZodTypeInternals<ProseInput, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"append-to-section">;
        slot: z.ZodString;
        paragraphs: z.ZodArray<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"replace-block">;
        slot: z.ZodString;
        blockId: z.ZodString;
        block: z.ZodType<ProseInput, unknown, z.core.$ZodTypeInternals<ProseInput, unknown>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"insert-blocks">;
        slot: z.ZodString;
        after: z.ZodNullable<z.ZodString>;
        blocks: z.ZodArray<z.ZodType<ProseInput, unknown, z.core.$ZodTypeInternals<ProseInput, unknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"remove-block">;
        slot: z.ZodString;
        blockId: z.ZodString;
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
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"add-section">;
        slot: z.ZodString;
        title: z.ZodString;
        after: z.ZodString;
        paragraphs: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"set-section-title">;
        slot: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        slot: z.ZodString;
        questionId: z.ZodString;
        question: z.ZodString;
        why: z.ZodDefault<z.ZodString>;
        kind: z.ZodDefault<z.ZodEnum<{
            text: "text";
            choice: "choice";
        }>>;
        options: z.ZodDefault<z.ZodArray<z.ZodString>>;
        op: z.ZodLiteral<"add-question">;
    }, z.core.$strip>], "op">;
    uses: z.ZodObject<{
        questions: z.ZodDefault<z.ZodArray<z.ZodString>>;
        comments: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    proposedBy: z.ZodString;
    proposedAt: z.ZodString;
}, z.core.$strip>;
export type PlanChange = z.infer<typeof planChangeSchema>;
/** What one pass proposes, before it is cut into changes. */
export interface PassOps {
    slot: string;
    ops: readonly AgentOp[];
    uses: RefineUses;
    proposedBy: string;
}
/** The pass, cut into one change per op and anchored to the blocks it is about. */
export declare function changesFor(blocks: readonly BlockJson[], pass: PassOps): PlanChange[];
/** The block an op is about: the one it rewrites or drops, or the one its new blocks follow. */
export declare function anchorOf(op: AgentOp): string | null;
/** One block as it reads now, hashed; empty for a block the plan no longer holds, or for no block at all. */
export declare function blockHash(blocks: readonly BlockJson[], blockId: string | null): string;
/** The words a change proposes, one line per block: none for a change that only drops a paragraph, since what goes is the paragraph it hangs under. */
export declare function changeWords(change: PlanChange): string[];
//# sourceMappingURL=plan-change.d.ts.map