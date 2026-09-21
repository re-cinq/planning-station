import {
  blocksOfType,
  type BlockJson,
  type PlanBlockOf,
} from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
import { partitionSections } from "../projection/partition.js";
import type { RefineUses } from "./refine-proposal.js";

type Question = PlanBlockOf<"question">;
type Comment = PlanBlockOf<"comment">;

export interface AnsweredQuestion {
  questionId: string;
  question: string;
  answer: string;
}

export interface OpenQuestion {
  questionId: string;
  question: string;
}

export interface CommentThread {
  commentId: string;
  said: { author: string; text: string }[];
}

/** What a section's conversation gives the agent: decisions to write in, and talk to leave alone. */
export interface RefineInputs {
  answered: AnsweredQuestion[];
  resolved: CommentThread[];
  openQuestions: OpenQuestion[];
  openThreads: CommentThread[];
}

/** Settled inputs no earlier refine used: answered questions and resolved threads. */
export function refineInputs(
  blocks: readonly BlockJson[],
  slot: string,
): RefineInputs {
  const talk = partitionSections(blocks).find((one) => one.slot === slot);
  const said = talk?.blocks ?? [];
  const questions = blocksOfType(said, "question").filter(isUnused);
  const threads = threadsIn(blocksOfType(said, "comment"));

  return {
    answered: questions.flatMap((question) => answeredIn(said, question)),
    openQuestions: questions
      .filter((question) => answeredIn(said, question).length === 0)
      .map((question) => ({
        questionId: idOf(question),
        question: textOf(question),
      })),
    resolved: threads.filter((thread) => thread.resolved).map(asThread),
    openThreads: threads.filter((thread) => !thread.resolved).map(asThread),
  };
}

export function settledCount(inputs: RefineInputs): number {
  return inputs.answered.length + inputs.resolved.length;
}

/** The ids a proposal built from these inputs uses, so accepting it can mark them. */
export function usesOf(inputs: RefineInputs): RefineUses {
  return {
    questions: inputs.answered.map((answered) => answered.questionId),
    comments: inputs.resolved.map((thread) => thread.commentId),
  };
}

/** Marks what a refine used, so the next one does not write it in twice. */
export function markUsed(
  blocks: readonly BlockJson[],
  uses: RefineUses,
): BlockJson[] {
  return blocks.map((block) =>
    usedBy(block, uses)
      ? ({ ...block, props: { ...block.props, used: true } } as BlockJson)
      : block,
  );
}

function usedBy(block: BlockJson, uses: RefineUses): boolean {
  if (block.type === "question") {
    return uses.questions.includes(block.props.questionId);
  }

  return (
    block.type === "comment" && uses.comments.includes(block.props.commentId)
  );
}

function answeredIn(
  said: readonly BlockJson[],
  question: Question,
): AnsweredQuestion[] {
  const answers = blocksOfType(said, "answer")
    .filter((answer) => answer.props.questionId === idOf(question))
    .map(textOf);

  return answers.length === 0
    ? []
    : [
        {
          questionId: idOf(question),
          question: textOf(question),
          answer: answers.join("; "),
        },
      ];
}

interface Thread {
  first: Comment;
  replies: Comment[];
  resolved: boolean;
}

function threadsIn(comments: readonly Comment[]): Thread[] {
  return comments
    .filter((comment) => !comment.props.replyTo && isUnused(comment))
    .map((first) => ({
      first,
      replies: comments.filter(
        (reply) => reply.props.replyTo === first.props.commentId,
      ),
      resolved: first.props.resolved,
    }));
}

function asThread({ first, replies }: Thread): CommentThread {
  return {
    commentId: first.props.commentId,
    said: [first, ...replies].map((comment) => ({
      author: comment.props.author,
      text: textOf(comment),
    })),
  };
}

function isUnused(block: Question | Comment): boolean {
  return !block.props.used;
}

function idOf(question: Question): string {
  return question.props.questionId || question.id;
}

function textOf(block: { content: Parameters<typeof plainText>[0] }): string {
  return plainText(block.content).trim();
}
