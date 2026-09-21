import { describe, it, expect } from "vitest";

import { planWith, textBlock } from "../testing/plans.js";
import { previewProposal } from "./proposal-preview.js";
import type { ProposedRefine } from "./refine-proposal.js";
import { sectionHash } from "./section-hash.js";

const PLAN = planWith("feature", {
  intent: [textBlock("paragraph", {}, "Checkout is slow.")],
  kpis: [
    textBlock(
      "kpi",
      { kpiId: "k1", metric: "p95", baseline: "3.2 s", target: "400 ms" },
      "Abandonment doubles above a second.",
    ),
  ],
});

const proposing = (
  slot: string,
  ops: ProposedRefine["ops"],
): ProposedRefine => ({
  status: "proposed",
  slot,
  baseHash: sectionHash(PLAN, slot),
  askedBy: "Ana",
  askedAt: "2026-09-21T10:00:00.000Z",
  ops,
  uses: { questions: [], comments: [] },
  proposedBy: "planning-agent",
  proposedAt: "2026-09-21T10:00:30.000Z",
});

const REWRITE_INTENT = proposing("intent", [
  {
    op: "set-section-text",
    slot: "intent",
    paragraphs: ["The price step spins for three seconds."],
  },
]);

describe("previewProposal", () => {
  it("marks the old intent line removed and the agent's line added", () => {
    expect(previewProposal(PLAN, REWRITE_INTENT)).toEqual({
      lines: [
        { kind: "removed", text: "Checkout is slow." },
        { kind: "added", text: "The price step spins for three seconds." },
      ],
      stale: false,
    });
  });

  it("reports the proposal stale once the intent was rewritten after Ana asked", () => {
    const rewritten = planWith("feature", {
      intent: [textBlock("paragraph", {}, "Checkout is slow on phones.")],
    });
    expect(previewProposal(rewritten, REWRITE_INTENT).stale).toBe(true);
  });

  it("shows the KPI p95 as one line of its fields and its rationale", () => {
    const lines = previewProposal(PLAN, proposing("kpis", [])).lines;
    expect(lines).toEqual([
      {
        kind: "kept",
        text: "p95 · 3.2 s · 400 ms · up — Abandonment doubles above a second.",
      },
    ]);
  });
});
