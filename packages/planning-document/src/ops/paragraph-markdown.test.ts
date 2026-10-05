import { describe, it, expect } from "vitest";

import type { BlockJson } from "../blocks/block-json.js";
import {
  blockText,
  planMeta,
  planWith,
  writtenBlocks,
} from "../testing/plans.js";
import { toPlanDocument } from "../projection/to-plan-document.js";
import type { AgentOp } from "./agent-ops.js";
import { applyOps } from "./apply-ops.js";

interface Outline {
  type: string;
  text: string;
  children: Outline[];
}

const SEEDED = planWith("feature", {});

const intentOf = (blocks: BlockJson[]) => {
  const { sections } = toPlanDocument(blocks, planMeta("feature"));
  const intent = sections.find((section) => section.slot === "intent");

  return writtenBlocks(intent?.blocks ?? []);
};

const outlined = (block: BlockJson): Outline => ({
  type: block.type,
  text: blockText(block),
  children: block.children.map(outlined),
});

const applied = (ops: AgentOp[], blocks = SEEDED) => applyOps(blocks, ops);

describe("an agent's paragraphs, read as Markdown", () => {
  it("writes a paragraph's Markdown as the heading, paragraph and nested list it describes, with no carriage return left", () => {
    const ops: AgentOp[] = [
      {
        op: "set-section-text",
        slot: "intent",
        paragraphs: [
          "## What changes\r\nThe api stops issuing tokens.\r\n- The dummy signs them\r\n  - with ES256",
        ],
      },
    ];
    expect(intentOf(applied(ops)).map(outlined)).toEqual([
      { type: "heading", text: "What changes", children: [] },
      {
        type: "paragraph",
        text: "The api stops issuing tokens.",
        children: [],
      },
      {
        type: "bulletListItem",
        text: "The dummy signs them",
        children: [
          { type: "bulletListItem", text: "with ES256", children: [] },
        ],
      },
    ]);
  });

  it("styles a paragraph's inline code and bold instead of keeping the backticks and asterisks", () => {
    const ops: AgentOp[] = [
      {
        op: "append-to-section",
        slot: "intent",
        paragraphs: ["Swap `createAccessTokenVerifier` **now**."],
      },
    ];
    expect(intentOf(applied(ops))).toMatchObject([
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Swap ", styles: {} },
          {
            type: "text",
            text: "createAccessTokenVerifier",
            styles: { code: true },
          },
          { type: "text", text: " ", styles: {} },
          { type: "text", text: "now", styles: { bold: true } },
          { type: "text", text: ".", styles: {} },
        ],
      },
    ]);
  });

  it("gives every block an appended list adds an id of its own, after what the section holds", () => {
    const first = applied([
      { op: "set-section-text", slot: "intent", paragraphs: ["One."] },
    ]);
    const appended = intentOf(
      applied(
        [{ op: "append-to-section", slot: "intent", paragraphs: ["- a\n- b"] }],
        first,
      ),
    );
    expect({
      texts: appended.map(blockText),
      ids: new Set(appended.map((block) => block.id)).size,
    }).toEqual({ texts: ["One.", "a", "b"], ids: 3 });
  });
});
