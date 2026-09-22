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
import { actionsBlock, panelBlock } from "../projection/seed.js";
import { toBlocks } from "../projection/to-blocks.js";
import { isCustomSlot } from "../template/templates.js";
import type {
  AgentOp,
  KpiInput,
  PrototypeInput,
  QuestionInput,
} from "./agent-ops.js";
import { toProseBlocks } from "./prose-input.js";

const KPIS_SLOT = "kpis";
const PROTOTYPE_SLOT = "prototype";

type Change = (section: Section) => BlockJson[];

type Handler<Kind extends AgentOp["op"]> = (
  blocks: BlockJson[],
  op: Extract<AgentOp, { op: Kind }>,
) => BlockJson[];

type Handlers = { [Kind in AgentOp["op"]]: Handler<Kind> };

const setSectionText: Handler<"set-section-text"> = (blocks, op) =>
  withProse(blocks, op.slot, paragraphs(op.slot, op.paragraphs));

const setSectionProse: Handler<"set-section-prose"> = (blocks, op) =>
  withProse(blocks, op.slot, toProseBlocks(op.slot, op.blocks));

const appendToSection: Handler<"append-to-section"> = (blocks, op) =>
  inSection(blocks, op.slot, (section) => [
    ...section.blocks,
    ...paragraphs(op.slot, op.paragraphs, section.blocks.length),
  ]);

const addSection: Handler<"add-section"> = (blocks, op) => {
  const sections = partitionSections(blocks);
  const after = sections.findIndex((section) => section.slot === op.after);
  const taken = sections.some((section) => section.slot === op.slot);

  return after < 0 || taken || !isCustomSlot(op.slot)
    ? blocks
    : withSections(blocks, sections.toSpliced(after + 1, 0, newSection(op)));
};

const setSectionTitle: Handler<"set-section-title"> = (blocks, op) =>
  blocks.map((block) =>
    block.type === "section-heading" &&
    block.props.slot === op.slot &&
    isCustomSlot(op.slot)
      ? parseBlock({ ...block, props: { ...block.props, title: op.title } })
      : block,
  );

const HANDLERS: Handlers = {
  "set-section-text": setSectionText,
  "set-section-prose": setSectionProse,
  "append-to-section": appendToSection,
  "upsert-kpi": (blocks, op) => upsert(blocks, KPIS_SLOT, kpiBlock(op.kpi)),
  "set-prototype": (blocks, op) =>
    upsert(blocks, PROTOTYPE_SLOT, prototypeBlock(op.prototype)),
  "add-section": addSection,
  "set-section-title": setSectionTitle,
  "add-question": (blocks, op) => upsert(blocks, op.slot, questionBlock(op)),
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

  return withSections(blocks, sections);
}

/** A section's prose is replaced whole, and the plan blocks in it stay. */
function withProse(
  blocks: readonly BlockJson[],
  slot: string,
  prose: readonly BlockJson[],
): BlockJson[] {
  return inSection(blocks, slot, (section) => [
    ...prose,
    ...section.blocks.filter(isPlanBlock),
  ]);
}

function withSections(
  blocks: readonly BlockJson[],
  sections: readonly Section[],
): BlockJson[] {
  return toBlocks({ sections: [...sections], title: planTitle(blocks) ?? "" });
}

function newSection(op: Extract<AgentOp, { op: "add-section" }>): Section {
  return {
    headingId: `heading-${op.slot}`,
    slot: op.slot,
    title: op.title,
    blocks: [
      panelBlock(op.slot),
      ...paragraphs(op.slot, op.paragraphs),
      actionsBlock(op.slot),
    ],
  };
}

function upsert(
  blocks: readonly BlockJson[],
  slot: string,
  block: BlockJson,
): BlockJson[] {
  const index = blocks.findIndex((current) => isSameEntity(current, block));

  if (index < 0) {
    return inSection(blocks, slot, (section) => [...section.blocks, block]);
  }

  return blocks.map((current, at) =>
    at === index ? { ...block, id: current.id } : current,
  );
}

// A block people made in the editor has an id of its own, so an entity is found by its key too.
const ENTITY_KEYS: Partial<Record<string, (block: BlockJson) => string>> = {
  kpi: (block) => propOf(block, "kpiId"),
  question: (block) => propOf(block, "questionId"),
  prototype: () => PROTOTYPE_SLOT,
};

function propOf(block: BlockJson, name: string): string {
  return String((block.props as Readonly<Record<string, unknown>>)[name]);
}

function isSameEntity(current: BlockJson, next: BlockJson): boolean {
  const keyOf = ENTITY_KEYS[next.type];

  return (
    current.id === next.id ||
    (current.type === next.type &&
      keyOf !== undefined &&
      keyOf(current) === keyOf(next))
  );
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

function questionBlock(input: QuestionInput): BlockJson {
  const { questionId, question, why, kind, options } = input;

  return parseBlock({
    id: questionId,
    type: "question",
    props: { questionId, why, kind, options: options.join(", ") },
    content: inlineFromText(question),
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
