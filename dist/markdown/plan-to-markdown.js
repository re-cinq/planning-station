import { blocksOfType, isPlanBlock, } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { partitionSections, planTitle } from "../projection/partition.js";
import { kpiInputOf, prototypeInputOf, sectionTitle } from "./live-section.js";
import { fenced, mockupNote, planHeading, quoted, sectionHeading, } from "./markdown-syntax.js";
import { writeProse } from "./write-prose.js";
const NOTHING = () => [];
const RENDERERS = {
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
        ...(answers.get(block.props.questionId) ?? []).map((answer) => quoted("Answer", `: ${oneLine(answer)}`)),
    ],
    comment: (block) => [
        quoted("Comment", ` by ${block.props.author}${resolvedMark(block)}: ${oneLine(block)}`),
    ],
};
/** Prose is written as the Markdown it reads as: lists, subheadings, quotes, code, tables, marks and links. */
export function planToMarkdown(blocks, template) {
    const sections = partitionSections(blocks).flatMap((section) => sectionLines(section, template));
    return [planHeading(planTitle(blocks) ?? ""), ...sections, ""].join("\n");
}
function sectionLines(section, template) {
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
function groupsOf(blocks) {
    const groups = [];
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
function joinsProse(group, block) {
    const [first] = group;
    return first !== undefined && !isPlanBlock(first) && !isPlanBlock(block);
}
function groupLines(group, answers) {
    const [first] = group;
    if (!first || !isPlanBlock(first)) {
        return writeProse(group);
    }
    const render = RENDERERS[first.type];
    return render(first, answers);
}
function answersOf(blocks) {
    return blocksOfType(blocks, "answer").reduce((byQuestion, answer) => byQuestion.set(answer.props.questionId, [
        ...(byQuestion.get(answer.props.questionId) ?? []),
        answer,
    ]), new Map());
}
function oneLine(block) {
    return plainText(block.content).replaceAll("\n", " ");
}
function resolvedMark(block) {
    return block.props.resolved ? " (resolved)" : "";
}
//# sourceMappingURL=plan-to-markdown.js.map