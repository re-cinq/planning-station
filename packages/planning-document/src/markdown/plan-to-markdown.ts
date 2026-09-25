import {
  blocksOfType,
  isPlanBlock,
  type BlockJson,
  type PlanBlockOf,
} from "../blocks/block-json.js";
import { plainText, type InlineContent } from "../blocks/inline-text.js";
import type { PlanBlockKind } from "../blocks/plan-block-configs.js";
import type { ProseBlock } from "../blocks/prose-blocks.js";
import type { Section } from "../plan/plan-document.js";
import { partitionSections, planTitle } from "../projection/partition.js";
import type { PlanTemplate } from "../template/template.js";
import { kpiInputOf, prototypeInputOf, sectionTitle } from "./live-section.js";
import {
  fenced,
  mockupNote,
  planHeading,
  quoted,
  sectionHeading,
} from "./markdown-syntax.js";
import { writeProse } from "./write-prose.js";

type Answers = ReadonlyMap<string, readonly PlanBlockOf<"answer">[]>;

type Render<Kind extends PlanBlockKind> = (
  block: PlanBlockOf<Kind>,
  answers: Answers,
) => string[];

const NOTHING = (): string[] => [];

const RENDERERS: { [Kind in PlanBlockKind]: Render<Kind> } = {
  "plan-title": NOTHING,
  "section-heading": NOTHING,
  "section-panel": NOTHING,
  "section-actions": NOTHING,
  answer: NOTHING,
  kpi: (block) => fenced("kpi", kpiInputOf(block)),
  prototype: (block) => fenced("prototype", prototypeInputOf(block)),
  mockup: (block) => [mockupNote(block.props.format)],
  question: (block, answers) => [
    quoted("Question", ` (${block.props.questionId}): ${oneLine(block)}`),
    ...(answers.get(block.props.questionId) ?? []).map((answer) =>
      quoted("Answer", `: ${oneLine(answer)}`),
    ),
  ],
  comment: (block) => [
    quoted(
      "Comment",
      ` by ${block.props.author}${resolvedMark(block)}: ${oneLine(block)}`,
    ),
  ],
  finding: (block) => [
    quoted(
      "Finding",
      ` (${block.props.findingId}, ${block.props.severity}): ${oneLine(block)}`,
    ),
  ],
};

/** Prose is written as the Markdown it reads as: lists, subheadings, quotes, code, tables, marks and links. */
export function planToMarkdown(
  blocks: readonly BlockJson[],
  template: PlanTemplate,
): string {
  const sections = partitionSections(blocks).flatMap((section) =>
    sectionLines(section, template),
  );

  return [planHeading(planTitle(blocks) ?? ""), ...sections, ""].join("\n");
}

function sectionLines(section: Section, template: PlanTemplate): string[] {
  const answers = answersOf(section.blocks);

  return [
    "",
    sectionHeading(sectionTitle(section, template), section.slot),
    ...groupsOf(section.blocks).flatMap((group) => {
      const lines = groupLines(group, answers);

      return lines.length > 0 ? ["", ...lines] : [];
    }),
  ];
}

/** Each plan block alone, and each run of prose together, so a list is written as one. */
function groupsOf(blocks: readonly BlockJson[]): BlockJson[][] {
  const groups: BlockJson[][] = [];

  for (const block of blocks) {
    const last = groups.at(-1);

    if (last && joinsProse(last, block)) {
      last.push(block);
      continue;
    }

    groups.push([block]);
  }

  return groups;
}

function joinsProse(group: readonly BlockJson[], block: BlockJson): boolean {
  const [first] = group;

  return first !== undefined && !isPlanBlock(first) && !isPlanBlock(block);
}

function groupLines(group: readonly BlockJson[], answers: Answers): string[] {
  const [first] = group;

  if (!first || !isPlanBlock(first)) {
    return writeProse(group as ProseBlock[]);
  }

  const render = RENDERERS[first.type] as Render<PlanBlockKind>;

  return render(first as PlanBlockOf<PlanBlockKind>, answers);
}

function answersOf(blocks: readonly BlockJson[]): Answers {
  return blocksOfType(blocks, "answer").reduce(
    (byQuestion, answer) =>
      byQuestion.set(answer.props.questionId, [
        ...(byQuestion.get(answer.props.questionId) ?? []),
        answer,
      ]),
    new Map<string, PlanBlockOf<"answer">[]>(),
  );
}

function oneLine(block: { content: InlineContent }): string {
  return plainText(block.content).replaceAll("\n", " ");
}

function resolvedMark(block: PlanBlockOf<"comment">): string {
  return block.props.resolved ? " (resolved)" : "";
}
