import { describe, it, expect } from "vitest";

import { blocksOfType, type BlockJson } from "../blocks/block-json.js";
import { toPlanDocument } from "../projection/to-plan-document.js";
import { planMeta, planWith } from "../testing/plans.js";
import { agentOpSchema } from "./agent-ops.js";
import { applyOps } from "./apply-ops.js";

const SEEDED = planWith("feature", {});

const FLOW_SKETCH = {
  mockupId: "m-flow-1",
  kind: "flow",
  format: "mermaid",
  caption: "Run of the loop",
  markup: "flowchart LR\n  a --> b",
  height: 320,
} as const;

const addMockup = (mockup: Record<string, unknown>) =>
  agentOpSchema.safeParse({ op: "add-mockup", mockup }).success;

const sketchesIn = (blocks: BlockJson[]) => {
  const { sections } = toPlanDocument(blocks, planMeta("feature"));
  const prototype = sections.find((section) => section.slot === "prototype");
  const mockups = blocksOfType(prototype?.blocks ?? [], "mockup");

  return mockups.map((block) => ({ id: block.id, props: block.props }));
};

describe("applyOps add-mockup", () => {
  it("adds sketch m-flow-1 to the Prototype section", () => {
    const blocks = applyOps(SEEDED, [
      { op: "add-mockup", mockup: FLOW_SKETCH },
    ]);
    expect(sketchesIn(blocks)).toEqual([
      { id: "m-flow-1", props: FLOW_SKETCH },
    ]);
  });

  it("replaces sketch m-flow-1 when it is sent again", () => {
    const once = applyOps(SEEDED, [{ op: "add-mockup", mockup: FLOW_SKETCH }]);
    const redrawn = { ...FLOW_SKETCH, markup: "flowchart TD\n  b --> c" };
    const twice = applyOps(once, [{ op: "add-mockup", mockup: redrawn }]);
    expect(sketchesIn(twice)).toEqual([{ id: "m-flow-1", props: redrawn }]);
  });

  it("refuses a sketch whose markup holds a script", () => {
    expect(
      addMockup({
        ...FLOW_SKETCH,
        format: "html",
        markup: "<div><SCRIPT>alert(1)</SCRIPT></div>",
      }),
    ).toBe(false);
  });

  it("refuses a sketch over 60000 characters", () => {
    expect(addMockup({ ...FLOW_SKETCH, markup: "a".repeat(60_001) })).toBe(
      false,
    );
  });

  it("refuses an svg sketch whose markup does not start with <svg", () => {
    expect(
      addMockup({ ...FLOW_SKETCH, format: "svg", markup: "<div></div>" }),
    ).toBe(false);
  });
});
