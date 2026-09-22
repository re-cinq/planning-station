import { z } from "zod";

import { newId } from "../lib/ids.js";
import {
  agentOpSchema,
  kpiInputSchema,
  prototypeInputSchema,
  questionInputSchema,
  type AgentOp,
  type KpiInput,
  type PrototypeInput,
} from "../ops/agent-ops.js";
import {
  changed,
  NO_CHANGE,
  problem,
  type MarkdownOps,
} from "./markdown-outcome.js";
import type { PlanFence } from "./markdown-syntax.js";
import type { Fence } from "./read-markdown.js";

/** What the plan holds now, for telling a changed fence from one written back as it was. */
export interface LiveEntities {
  kpis: ReadonlyMap<string, KpiInput>;
  prototype: PrototypeInput | null;
}

interface FenceInput extends LiveEntities {
  value: unknown;
  slot: string;
}

// A KPI people added in the editor may have no metric yet; it still reads back unchanged.
const kpiFenceSchema = kpiInputSchema.extend({
  kpiId: z.string().default(""),
  metric: z.string().default(""),
});

const questionFenceSchema = questionInputSchema.omit({
  slot: true,
  questionId: true,
});

const FENCE_OPS: Record<PlanFence, (input: FenceInput) => MarkdownOps> = {
  kpi: (input) =>
    fenceOp(kpiFenceSchema, input, (kpi) =>
      same(kpiFenceSchema, input.kpis.get(kpi.kpiId), kpi)
        ? null
        : {
            op: "upsert-kpi",
            kpi: { ...kpi, kpiId: kpi.kpiId || newId("kpi") },
          },
    ),
  prototype: (input) =>
    fenceOp(prototypeInputSchema, input, (prototype) =>
      same(prototypeInputSchema, input.prototype, prototype)
        ? null
        : { op: "set-prototype", prototype },
    ),
  question: (input) =>
    fenceOp(questionFenceSchema, input, (question) => ({
      op: "add-question",
      slot: input.slot,
      questionId: newId("q"),
      ...question,
    })),
};

export function fenceOps(
  fence: Fence,
  slot: string,
  live: LiveEntities,
): MarkdownOps {
  const value = fence.closed ? parseJson(fence.body) : undefined;

  return value === undefined
    ? problem("invalid-fence", slot, `the ${fence.tag} fence is not JSON`)
    : FENCE_OPS[fence.tag]({ ...live, value, slot });
}

function fenceOp<Schema extends z.ZodType>(
  schema: Schema,
  { value, slot }: FenceInput,
  toOp: (parsed: z.output<Schema>) => AgentOp | null,
): MarkdownOps {
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

function same(schema: z.ZodType, live: unknown, written: unknown): boolean {
  const known = schema.safeParse(live);

  return (
    known.success && JSON.stringify(known.data) === JSON.stringify(written)
  );
}

function issuesOf({ issues }: z.ZodError): string {
  return issues.map(describeIssue).join("; ");
}

function describeIssue({ path, message }: z.core.$ZodIssue): string {
  return `${path.join(".") || "fence"}: ${message}`;
}

// JSON.parse is the one way to read JSON, and it throws on text that is not.
function parseJson(body: string): unknown {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return undefined;
  }
}
