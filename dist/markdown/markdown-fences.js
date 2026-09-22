import { parseJson } from "../lib/parse-json.js";
import { z } from "zod";
import { newId } from "../lib/ids.js";
import { agentOpSchema, kpiInputSchema, prototypeInputSchema, questionInputSchema, } from "../ops/agent-ops.js";
import { changed, NO_CHANGE, problem, } from "./markdown-outcome.js";
// A KPI people added in the editor may have no metric yet; it still reads back unchanged.
const kpiFenceSchema = kpiInputSchema.extend({
    kpiId: z.string().default(""),
    metric: z.string().default(""),
});
const questionFenceSchema = questionInputSchema.omit({
    slot: true,
    questionId: true,
});
const FENCE_OPS = {
    kpi: (input) => fenceOp(kpiFenceSchema, input, (kpi) => same(kpiFenceSchema, input.kpis.get(kpi.kpiId), kpi)
        ? null
        : {
            op: "upsert-kpi",
            kpi: { ...kpi, kpiId: kpi.kpiId || newId("kpi") },
        }),
    prototype: (input) => fenceOp(prototypeInputSchema, input, (prototype) => same(prototypeInputSchema, input.prototype, prototype)
        ? null
        : { op: "set-prototype", prototype }),
    question: (input) => fenceOp(questionFenceSchema, input, (question) => ({
        op: "add-question",
        slot: input.slot,
        questionId: newId("q"),
        ...question,
    })),
};
export function fenceOps(fence, slot, live) {
    const value = fence.closed ? parseJson(fence.body) : undefined;
    return value === undefined
        ? problem("invalid-fence", slot, `the ${fence.tag} fence is not JSON`)
        : FENCE_OPS[fence.tag]({ ...live, value, slot });
}
function fenceOp(schema, { value, slot }, toOp) {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
        return problem("invalid-fence", slot, issuesOf(parsed.error));
    }
    const op = toOp(parsed.data);
    const checked = op && agentOpSchema.safeParse(op);
    if (!checked) {
        return NO_CHANGE;
    }
    return checked.success
        ? changed(checked.data)
        : problem("invalid-fence", slot, issuesOf(checked.error));
}
function same(schema, live, written) {
    const known = schema.safeParse(live);
    return (known.success && JSON.stringify(known.data) === JSON.stringify(written));
}
function issuesOf({ issues }) {
    return issues.map(describeIssue).join("; ");
}
function describeIssue({ path, message }) {
    return `${path.join(".") || "fence"}: ${message}`;
}
//# sourceMappingURL=markdown-fences.js.map