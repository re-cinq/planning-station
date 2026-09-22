import { z } from "zod";
import { agentOpsSchema, enforceTrue, planKindSchema, refineUsesSchema, } from "@re-cinq/planning-document";
import { toProblem, UnauthorizedError } from "./problem.js";
const newPlanSchema = z.object({
    repo: z.string().min(1),
    title: z.string().min(1),
    type: planKindSchema,
    createdBy: z.string().min(1),
});
const approveSchema = z.object({ approvedBy: z.string().min(1) });
const agentEditsSchema = z.object({
    actor: z.string().min(1),
    ops: agentOpsSchema,
    base: z
        .object({ slot: z.string().min(1), hash: z.string().min(1) })
        .optional(),
});
const proposalSchema = z.object({
    actor: z.string().min(1),
    slot: z.string().min(1),
    baseHash: z.string().min(1),
    ops: agentOpsSchema,
    uses: refineUsesSchema.default({ questions: [], comments: [] }),
});
const ROUTES = [
    {
        method: "POST",
        path: "",
        status: 201,
        run: ({ service }, request) => service.createPlan(newPlanSchema.parse(request.payload)),
    },
    {
        method: "GET",
        path: "/{planId}",
        status: 200,
        run: ({ service }, request) => service.readPlan(planId(request)),
    },
    {
        method: "GET",
        path: "/{planId}/versions",
        status: 200,
        run: async ({ service }, request) => ({
            versions: await service.listVersions(planId(request)),
        }),
    },
    {
        method: "GET",
        path: "/{planId}/versions/{number}",
        status: 200,
        run: ({ service }, request) => service.getVersion(planId(request), Number(request.params.number)),
    },
    {
        method: "POST",
        path: "/{planId}/approve",
        status: 200,
        run: ({ service }, request) => service.approvePlan({
            planId: planId(request),
            ...approveSchema.parse(request.payload),
        }),
    },
    {
        method: "POST",
        path: "/{planId}/reopen",
        status: 200,
        run: ({ service }, request) => service.reopenPlan(planId(request)),
    },
    {
        method: "POST",
        path: "/{planId}/agent-edits",
        status: 200,
        run: ({ writer }, request) => writer.applyOps({
            planId: planId(request),
            ...agentEditsSchema.parse(request.payload),
        }),
    },
    {
        method: "POST",
        path: "/{planId}/proposals",
        status: 201,
        run: ({ writer }, request) => writer.propose({
            planId: planId(request),
            ...proposalSchema.parse(request.payload),
        }),
    },
];
export function planningRoutes(options) {
    return ROUTES.map((spec) => ({
        method: spec.method,
        path: `${options.prefix}${spec.path}`,
        handler: (request, toolkit) => runRoute({ options, spec }, request, toolkit),
    }));
}
async function runRoute({ options, spec }, request, toolkit) {
    try {
        enforceTrue(options.serviceAuth(request), UnauthorizedError, `not allowed to call ${request.path}`);
        const answer = await spec.run(options.api, request);
        return toolkit.response(answer).code(spec.status);
    }
    catch (error) {
        const problem = toProblem(error);
        return toolkit.response(problem).code(problem.status);
    }
}
function planId(request) {
    return String(request.params.planId);
}
//# sourceMappingURL=routes.js.map