import { describe, it, expect } from "vitest";
import {
  ProposalScopeError,
  sectionHash,
  SectionChangedError,
  type AgentOp,
} from "@re-cinq/planning-document";
import {
  blockText,
  planWith,
  textBlock,
} from "@re-cinq/planning-document/testing";
import type { Doc } from "yjs";

import { applyOpsToDoc } from "../convert/apply-ops.js";
import { docFromBlocks, readBlocks } from "../convert/plan-doc.js";
import {
  acceptRefine,
  applyRefineAnyway,
  askRefine,
  discardRefine,
  failRefine,
  finishRefine,
  NoProposalError,
  proposalsIn,
  proposePass,
  proposeRefine,
} from "./proposals.js";

const OUT_OF_SCOPE: AgentOp = {
  op: "append-to-section",
  slot: "scope",
  paragraphs: ["Out: the payment provider's page."],
};

const seeded = () =>
  docFromBlocks(
    planWith("feature", {
      scope: [
        textBlock("paragraph", {}, "In: the price step."),
        textBlock("question", { questionId: "q-tax" }, "Which markets?"),
        textBlock("answer", { questionId: "q-tax" }, "Only the EU."),
      ],
    }),
  );

const askedByAna = () => {
  const doc = seeded();
  const { baseHash } = askRefine(doc, { slot: "scope", askedBy: "Ana" });

  return { doc, baseHash };
};

const proposed = () => {
  const { doc, baseHash } = askedByAna();
  proposeRefine(doc, {
    slot: "scope",
    baseHash,
    ops: [OUT_OF_SCOPE],
    uses: { questions: ["q-tax"], comments: [] },
    proposedBy: "planning-agent",
  });

  return doc;
};

const scopeText = (doc: Doc) =>
  readBlocks(doc)
    .filter((block) => block.type === "paragraph")
    .map(blockText);

describe("refine proposals", () => {
  it("shows Ana's ask for scope to everyone on the plan", () => {
    const { doc } = askedByAna();
    expect(proposalsIn(doc)).toMatchObject([
      { status: "asked", slot: "scope", askedBy: "Ana" },
    ]);
  });

  it("keeps the agent's proposal under Ana's name, without writing it into the plan", () => {
    const doc = proposed();
    expect({
      proposals: proposalsIn(doc),
      scope: scopeText(doc),
    }).toMatchObject({
      proposals: [
        { status: "proposed", askedBy: "Ana", uses: { questions: ["q-tax"] } },
      ],
      scope: ["In: the price step."],
    });
  });

  it("throws ProposalScopeError when a proposal for scope changes the intent", () => {
    const { doc, baseHash } = askedByAna();
    expect(() =>
      proposeRefine(doc, {
        slot: "scope",
        baseHash,
        ops: [{ op: "append-to-section", slot: "intent", paragraphs: ["x"] }],
        uses: { questions: [], comments: [] },
        proposedBy: "planning-agent",
      }),
    ).toThrow(ProposalScopeError);
  });

  it("writes the accepted paragraph into scope and clears the proposal", () => {
    const doc = proposed();
    acceptRefine(doc, "scope");
    expect({ proposals: proposalsIn(doc), scope: scopeText(doc) }).toEqual({
      proposals: [],
      scope: ["In: the price step.", "Out: the payment provider's page."],
    });
  });

  it("marks q-tax used when the proposal that used it is accepted", () => {
    const doc = proposed();
    acceptRefine(doc, "scope");
    expect(
      readBlocks(doc).find((block) => block.type === "question")?.props,
    ).toMatchObject({ questionId: "q-tax", used: true });
  });

  it("throws SectionChangedError when scope changed after Ana asked", () => {
    const doc = proposed();
    applyOpsToDoc(doc, [
      { op: "append-to-section", slot: "scope", paragraphs: ["Ben typed."] },
    ]);
    expect(() => acceptRefine(doc, "scope")).toThrow(SectionChangedError);
  });

  it("applies a proposal anyway onto the scope Ana changed after asking, keeping what she wrote", () => {
    const doc = proposed();
    applyOpsToDoc(doc, [
      { op: "append-to-section", slot: "scope", paragraphs: ["Ben typed."] },
    ]);
    applyRefineAnyway(doc, "scope");
    expect({ proposals: proposalsIn(doc), scope: scopeText(doc) }).toEqual({
      proposals: [],
      scope: [
        "In: the price step.",
        "Ben typed.",
        "Out: the payment provider's page.",
      ],
    });
  });

  it("drops a discarded proposal and leaves scope as it was", () => {
    const doc = proposed();
    discardRefine(doc, "scope");
    expect({ proposals: proposalsIn(doc), scope: scopeText(doc) }).toEqual({
      proposals: [],
      scope: ["In: the price step."],
    });
  });

  it("throws NoProposalError when scope is accepted before the agent answered", () => {
    const { doc } = askedByAna();
    expect(() => acceptRefine(doc, "scope")).toThrow(NoProposalError);
  });
});

describe("finishRefine", () => {
  it("clears the ask and marks q-1 used after direct live edits answer intent", () => {
    const doc = docFromBlocks(
      planWith("feature", {
        intent: [
          textBlock("question", { questionId: "q-1" }, "Which tier?"),
        ],
      }),
    );
    askRefine(doc, { slot: "intent", askedBy: "Ana" });

    finishRefine(doc, {
      slot: "intent",
      uses: { questions: ["q-1"], comments: [] },
    });

    const question = readBlocks(doc).find((block) => block.type === "question");
    expect({
      ask: proposalsIn(doc).find((proposal) => proposal.slot === "intent"),
      used: question?.props.used,
    }).toEqual({ ask: undefined, used: true });
  });
});

describe("proposePass", () => {
  const ripple: AgentOp = {
    op: "append-to-section",
    slot: "intent",
    paragraphs: ["Only the EU, so the plan is EU-only."],
  };

  it("proposes the asked section and every other section an answer forced, each against itself", () => {
    const { doc, baseHash } = askedByAna();
    const outcome = proposePass(
      doc,
      {
        asked: { slot: "scope", baseHash },
        ops: [OUT_OF_SCOPE, ripple],
        uses: { questions: ["q-tax"], comments: [] },
        proposedBy: "planning-agent",
      },
      "agent",
    );

    expect({
      outcome,
      proposals: proposalsIn(doc)
        .map((proposal) => `${proposal.slot}:${proposal.status}`)
        .sort(),
    }).toEqual({
      outcome: { proposed: ["scope", "intent"], skipped: [] },
      proposals: ["intent:proposed", "scope:proposed"],
    });
  });

  const intentPassRipplingIntoScope = (doc: Doc) =>
    proposePass(
      doc,
      {
        asked: {
          slot: "intent",
          baseHash: sectionHash(readBlocks(doc), "intent"),
        },
        ops: [ripple, OUT_OF_SCOPE],
        uses: { questions: [], comments: [] },
        proposedBy: "planning-agent",
      },
      "agent",
    );

  it("leaves a section whose proposal someone is already reviewing, rather than replacing it", () => {
    expect(intentPassRipplingIntoScope(proposed())).toEqual({
      proposed: ["intent"],
      skipped: ["scope"],
    });
  });

  it("replaces a section whose refine failed, since nobody is reviewing it", () => {
    const { doc } = askedByAna();
    failRefine(doc, { slot: "scope", reason: AGENT_CRASHED });

    expect(intentPassRipplingIntoScope(doc)).toEqual({
      proposed: ["intent", "scope"],
      skipped: [],
    });
  });
});

const AGENT_CRASHED = "the agent crashed before its first turn";

describe("failRefine", () => {
  it("turns Ana's ask for scope into a failed refine that keeps her name, her time and the section she asked against", () => {
    const { doc, baseHash } = askedByAna();
    const [asked] = proposalsIn(doc);
    failRefine(doc, { slot: "scope", reason: AGENT_CRASHED });

    expect(proposalsIn(doc)).toMatchObject([
      {
        status: "failed",
        slot: "scope",
        baseHash,
        askedBy: "Ana",
        askedAt: asked?.askedAt,
        reason: AGENT_CRASHED,
      },
    ]);
  });

  it("leaves the agent's proposal for scope alone when a failure arrives after it", () => {
    const doc = proposed();
    const kept = failRefine(doc, { slot: "scope", reason: AGENT_CRASHED });

    expect({ kept, proposals: proposalsIn(doc) }).toMatchObject({
      kept: { status: "proposed" },
      proposals: [{ status: "proposed", slot: "scope" }],
    });
  });

  it("returns nothing and writes nothing when nobody asked to refine scope", () => {
    const doc = seeded();

    expect({
      kept: failRefine(doc, { slot: "scope", reason: AGENT_CRASHED }),
      proposals: proposalsIn(doc),
    }).toEqual({ kept: undefined, proposals: [] });
  });

  it("replaces the failed refine of scope with Ben's new ask", () => {
    const { doc } = askedByAna();
    failRefine(doc, { slot: "scope", reason: AGENT_CRASHED });
    askRefine(doc, { slot: "scope", askedBy: "Ben" });

    expect(proposalsIn(doc)).toMatchObject([
      { status: "asked", slot: "scope", askedBy: "Ben" },
    ]);
  });

  it("throws NoProposalError when a failed refine of scope is accepted", () => {
    const { doc } = askedByAna();
    failRefine(doc, { slot: "scope", reason: AGENT_CRASHED });

    expect(() => acceptRefine(doc, "scope")).toThrow(NoProposalError);
  });
});
