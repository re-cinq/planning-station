import { describe, it, expect } from "vitest";

import {
  enforceInSection,
  ProposalScopeError,
  refineProposalSchema,
} from "./refine-proposal.js";

const ASKED = {
  status: "asked",
  slot: "scope",
  baseHash: "1f2e3d",
  askedBy: "Ana",
  askedAt: "2026-09-21T10:00:00.000Z",
};

const APPEND_SCOPE = {
  op: "append-to-section" as const,
  slot: "scope",
  paragraphs: ["Out: the payment page."],
};

describe("refineProposalSchema", () => {
  it("parses a proposed refine of scope with the answer q-tax it used", () => {
    const proposal = refineProposalSchema.parse({
      ...ASKED,
      status: "proposed",
      ops: [APPEND_SCOPE],
      uses: { questions: ["q-tax"] },
      proposedBy: "planning-agent",
      proposedAt: "2026-09-21T10:00:30.000Z",
    });
    expect(proposal).toMatchObject({
      uses: { questions: ["q-tax"], comments: [] },
    });
  });

  it("rejects a refine asked for without a base hash", () => {
    expect(
      refineProposalSchema.safeParse({ ...ASKED, baseHash: "" }).success,
    ).toBe(false);
  });
});

describe("enforceInSection", () => {
  it("lets a refine of scope append to scope", () => {
    expect(() => enforceInSection("scope", [APPEND_SCOPE])).not.toThrow();
  });

  it("lets a refine of scope ask a question in scope", () => {
    expect(() =>
      enforceInSection("scope", [
        {
          op: "add-question",
          slot: "scope",
          questionId: "q-flag",
          question: "Which flag?",
          why: "",
          kind: "text",
          options: [],
        },
      ]),
    ).not.toThrow();
  });

  it("throws ProposalScopeError when a refine of scope adds the custom-rollout section", () => {
    expect(() =>
      enforceInSection("scope", [
        {
          op: "add-section",
          slot: "custom-rollout",
          title: "Rollout",
          after: "scope",
          paragraphs: [],
        },
        { op: "set-section-title", slot: "custom-rollout", title: "Rollout" },
      ]),
    ).toThrow(
      new ProposalScopeError(
        "a refine of scope may not change custom-rollout, custom-rollout",
      ),
    );
  });

  it("throws ProposalScopeError when a refine of scope changes a KPI", () => {
    expect(() =>
      enforceInSection("scope", [{ op: "upsert-kpi", kpi: agentKpi() }]),
    ).toThrow(new ProposalScopeError("a refine of scope may not change kpis"));
  });
});

function agentKpi() {
  return {
    kpiId: "k1",
    metric: "p95",
    baseline: "",
    target: "",
    direction: "down" as const,
    deadline: "",
    rationale: "",
  };
}
