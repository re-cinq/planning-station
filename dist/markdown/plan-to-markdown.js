import { blocksOfType, isPlanBlock, } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { partitionSections, planTitle } from "../projection/partition.js";
import { kpiInputOf, proseTexts, prototypeInputOf, sectionTitle, } from "./live-section.js";
import { escapeLine, fenced, mockupNote, planHeading, quoted, sectionHeading, } from "./markdown-syntax.js";
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
/** Prose is flattened to its text, so lists and headings read as paragraphs and a table is left out. */
export function planToMarkdown(blocks, template) {
    const sections = partitionSections(blocks).flatMap((section) => sectionLines(section, template));
    return [planHeading(planTitle(blocks) ?? ""), ...sections, ""].join("\n");
}
function sectionLines(section, template) {
    const answers = answersOf(section.blocks);
    return [
        "",
        sectionHeading(sectionTitle(section, template), section.slot),
        ...section.blocks.flatMap((block) => blockLines(block, answers)),
    ];
}
function blockLines(block, answers) {
    if (!isPlanBlock(block)) {
        return proseTexts(block)
            .filter((text) => text !== "")
            .flatMap((text) => ["", ...text.split("\n").map(escapeLine)]);
    }
    const render = RENDERERS[block.type];
    const lines = render(block, answers);
    return lines.length > 0 ? ["", ...lines] : [];
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