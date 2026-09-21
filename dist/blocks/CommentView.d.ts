import { BlockUpdater } from './PlanBlockView.js';
import { BlockInserter } from './QuestionView.js';
interface CommentBlock {
    id: string;
    type?: string;
    props: Record<string, unknown>;
}
export interface CommentViewProps {
    block: CommentBlock;
    editor: BlockInserter & BlockUpdater;
    contentRef?: (node: HTMLElement | null) => void;
}
/** A comment in the margin; the first of a thread carries its replies and whether it is resolved. */
export declare function CommentView({ block, editor, contentRef }: CommentViewProps): import("react").JSX.Element;
export {};
