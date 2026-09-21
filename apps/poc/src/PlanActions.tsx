import type { AgentOp, RefineInputs } from "@re-cinq/planning-document";
import type { RefineRequest } from "@re-cinq/planning-editor";

import styles from "./App.module.scss";
import { agentProposes, agentWrites, type PlanServer } from "./plan-server.js";

const THINKING_MS = 1500;

const AGENT_OPS: AgentOp[] = [
  {
    op: "set-section-text",
    slot: "intent",
    paragraphs: [
      "The planning agent rewrote this paragraph while you were reading it.",
    ],
  },
  {
    op: "upsert-kpi",
    kpi: {
      kpiId: "k-latency",
      metric: "Price step p95 on mobile",
      baseline: "3.2 s",
      target: "300 ms",
      direction: "down",
      deadline: "2026-12-15",
      rationale: "The agent tightened the target after reading the comments.",
    },
  },
];

/** A stand-in agent: it takes a moment, then proposes the settled decisions as prose. */
export async function refineSection(
  server: PlanServer,
  { slot, inputs, uses, baseHash }: RefineRequest,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, THINKING_MS));
  await agentProposes(server, {
    slot,
    baseHash,
    uses,
    ops: [{ op: "append-to-section", slot, paragraphs: decisionsOf(inputs) }],
  });
}

function decisionsOf({ answered, resolved }: RefineInputs): string[] {
  return [
    ...answered.map(({ question, answer }) => `${question} ${answer}.`),
    ...resolved.map(({ said }) => `Agreed: ${said.at(-1)?.text ?? ""}`),
  ];
}

export function PlanActions({ server }: { server: PlanServer }) {
  return (
    <p className={styles.actions}>
      <button type="button" onClick={() => void agentWrites(server, AGENT_OPS)}>
        The agent writes
      </button>
    </p>
  );
}
