import { describe, it, expect } from "vitest";
import {
  markdownToOps,
  planToMarkdown,
  templateFor,
  type AgentOp,
} from "@re-cinq/planning-document";
import {
  blockText,
  planWith,
  readyFeature,
  richFeature,
} from "@re-cinq/planning-document/testing";
import { applyUpdate, Doc, encodeStateAsUpdate } from "yjs";

import { docFromBlocks, readBlocks } from "./plan-doc.js";
import { applyOpsToDoc, UnseededDocError } from "./apply-ops.js";

const latency = (target: string): AgentOp => ({
  op: "upsert-kpi",
  kpi: {
    kpiId: "k-latency",
    metric: "checkout p95",
    baseline: "450 ms",
    target,
    direction: "down",
    deadline: "",
    rationale: "",
  },
});

const kpisIn = (doc: Doc) =>
  readBlocks(doc).filter((block) => block.type === "kpi");

const INTENT: AgentOp = {
  op: "set-section-text",
  slot: "intent",
  paragraphs: ["Checkout is slow on mobile."],
};

const seeded = () => docFromBlocks(planWith("feature", {}));

const texts = (doc: Doc) =>
  readBlocks(doc)
    .filter((block) => block.type === "paragraph")
    .map(blockText);

const copyOf = (doc: Doc) => {
  const replica = new Doc();
  applyUpdate(replica, encodeStateAsUpdate(doc));

  return replica;
};

describe("applyOpsToDoc", () => {
  it("writes the agent's paragraph into the live document", () => {
    const doc = seeded();
    applyOpsToDoc(doc, [INTENT]);
    expect(texts(doc)).toEqual(["Checkout is slow on mobile."]);
  });

  it("writes the agent's KPI into the success criteria", () => {
    const doc = seeded();
    applyOpsToDoc(doc, [latency("200 ms")]);
    expect(kpisIn(doc)).toHaveLength(1);
  });

  it("sends the change to everyone else as one update", () => {
    const doc = seeded();
    const replica = copyOf(doc);
    doc.on("update", (update: Uint8Array) => applyUpdate(replica, update));
    applyOpsToDoc(doc, [INTENT]);
    expect(texts(replica)).toEqual(["Checkout is slow on mobile."]);
  });

  it("leaves the blocks it did not touch untouched", () => {
    const doc = docFromBlocks(readyFeature());
    const untouched = readBlocks(doc).filter(
      (block) => block.type === "section-heading",
    );
    applyOpsToDoc(doc, [INTENT]);
    expect(
      readBlocks(doc).filter((block) => block.type === "section-heading"),
    ).toEqual(untouched);
  });

  it("keeps a person's own words in another section while the agent writes", () => {
    const doc = docFromBlocks(readyFeature());
    const before = texts(doc);
    applyOpsToDoc(doc, [latency("200 ms")]);
    expect(texts(doc)).toEqual(before);
  });

  it("revises the agent's KPI in place when it writes it again", () => {
    const doc = seeded();
    applyOpsToDoc(doc, [latency("200 ms")]);
    applyOpsToDoc(doc, [latency("150 ms")]);
    expect(kpisIn(doc)).toMatchObject([{ props: { target: "150 ms" } }]);
  });

  it("writes the agent's lists, marks, code and table into the live document and reads them back as the same plan.md", () => {
    const doc = seeded();
    const feature = templateFor("feature");
    const markdown = planToMarkdown(richFeature(), feature);
    const { ops } = markdownToOps(markdown, readBlocks(doc), feature);
    applyOpsToDoc(doc, ops);
    expect(planToMarkdown(readBlocks(doc), feature)).toEqual(markdown);
  });

  it("throws UnseededDocError when the document holds no plan yet", () => {
    expect(() => applyOpsToDoc(new Doc(), [INTENT])).toThrow(UnseededDocError);
  });
});
