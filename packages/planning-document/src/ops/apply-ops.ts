import {
  isPlanBlock,
  parseBlock,
  type BlockJson,
} from "../blocks/block-json.js";
import { inlineFromText } from "../blocks/inline-text.js";
import type { Section } from "../plan/plan-document.js";
import {
  partitionSections,
  planTitle,
  sectionOrder,
} from "../projection/partition.js";
import { toBlocks } from "../projection/to-blocks.js";
import type { AgentOp, KpiInput, PrototypeInput } from "./agent-ops.js";

const KPIS_SLOT = "kpis";
const PROTOTYPE_SLOT = "prototype";

type Change = (section: Section) => BlockJson[];

type Handler<Kind extends AgentOp["op"]> = (
  blocks: BlockJson[],
  op: Extract<AgentOp, { op: Kind }>,
) => BlockJson[];

type Handlers = { [Kind in AgentOp["op"]]: Handler<Kind> };

const setSectionText: Handler<"set-section-text"> = (blocks, op) =>
  inSection(blocks, op.slot, (section) => [
    ...paragraphs(op.slot, op.paragraphs),
    ...section.blocks.filter(isPlanBlock),
  ]);

const appendToSection: Handler<"append-to-section"> = (blocks, op) =>
  inSection(blocks, op.slot, (section) => [
    ...section.blocks,
    ...paragraphs(op.slot, op.paragraphs, section.blocks.length),
  ]);

const HANDLERS: Handlers = {
  "set-section-text": setSectionText,
  "append-to-section": appendToSection,
  "upsert-kpi": (blocks, op) => upsert(blocks, KPIS_SLOT, kpiBlock(op.kpi)),
  "set-prototype": (blocks, op) =>
    upsert(blocks, PROTOTYPE_SLOT, prototypeBlock(op.prototype)),
};

/** Applies the planning agent's edits to a plan's blocks. */
export function applyOps(
  blocks: readonly BlockJson[],
  ops: readonly AgentOp[],
): BlockJson[] {
  return ops.reduce<BlockJson[]>(applyOp, [...blocks]);
}

function applyOp(blocks: BlockJson[], op: AgentOp): BlockJson[] {
  const apply = HANDLERS[op.op] as (
    blocks: BlockJson[],
    op: AgentOp,
  ) => BlockJson[];

  return apply(blocks, op);
}

function inSection(
  blocks: readonly BlockJson[],
  slot: string,
  change: Change,
): BlockJson[] {
  const sections = partitionSections(blocks).map((section) =>
    section.slot === slot
      ? { ...section, blocks: sectionOrder(change(section)) }
      : section,
  );

  return toBlocks({ sections, title: planTitle(blocks) ?? "" });
}

function upsert(
  blocks: readonly BlockJson[],
  slot: string,
  block: BlockJson,
): BlockJson[] {
  const index = blocks.findIndex((current) => current.id === block.id);

  if (index < 0) {
    return inSection(blocks, slot, (section) => [...section.blocks, block]);
  }

  return blocks.map((current, at) => (at === index ? block : current));
}

function paragraphs(
  slot: string,
  texts: readonly string[],
  offset = 0,
): BlockJson[] {
  return texts.map((text, index) =>
    parseBlock({
      id: `${slot}-p-${offset + index + 1}`,
      type: "paragraph",
      props: {},
      content: inlineFromText(text),
    }),
  );
}

function kpiBlock(kpi: KpiInput): BlockJson {
  const { kpiId, rationale, ...props } = kpi;

  return parseBlock({
    id: kpiId,
    type: "kpi",
    props: { kpiId, ...props },
    content: inlineFromText(rationale),
  });
}

function prototypeBlock(prototype: PrototypeInput): BlockJson {
  const { notes, ...props } = prototype;

  return parseBlock({
    id: PROTOTYPE_SLOT,
    type: "prototype",
    props,
    content: inlineFromText(notes),
  });
}
