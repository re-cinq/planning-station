import { z } from "zod";
import { enforceTrue } from "../lib/enforce.js";
import { agentOpsSchema } from "../ops/agent-ops.js";
const KPIS_SLOT = "kpis";
const PROTOTYPE_SLOT = "prototype";
export const refineUsesSchema = z.object({
    questions: z.array(z.string()).default([]),
    comments: z.array(z.string()).default([]),
});
const askedSchema = z.object({
    status: z.literal("asked"),
    slot: z.string().min(1),
    baseHash: z.string().min(1),
    askedBy: z.string(),
    askedAt: z.string(),
});
const proposedSchema = askedSchema.extend({
    status: z.literal("proposed"),
    ops: agentOpsSchema,
    uses: refineUsesSchema,
    proposedBy: z.string(),
    proposedAt: z.string(),
});
/** One section's refine: asked for by a person, then proposed by the agent, until someone accepts or discards it. */
export const refineProposalSchema = z.discriminatedUnion("status", [
    askedSchema,
    proposedSchema,
]);
export class ProposalScopeError extends Error {
}
/** A refine answers for one section, so every op it carries must stay inside it. */
export function enforceInSection(slot, ops) {
    const strays = ops.filter((op) => slotOf(op) !== slot);
    enforceTrue(strays.length === 0, ProposalScopeError, `a refine of ${slot} may not change ${strays.map(slotOf).join(", ")}`);
}
/** The section an op writes into — how a host keeps only the ops a Refine may carry. */
export function slotOf(op) {
    if (op.op === "upsert-kpi") {
        return KPIS_SLOT;
    }
    return op.op === "set-prototype" ? PROTOTYPE_SLOT : op.slot;
}
//# sourceMappingURL=refine-proposal.js.map