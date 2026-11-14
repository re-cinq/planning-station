import { BlockInserter } from './QuestionView.js';
export interface CommentComposerProps {
    block: {
        id: string;
        props: {
            slot: string;
            title: string;
        };
    };
    editor: BlockInserter;
    onDone: () => void;
}
/** A one-line comment on a section, asked for from its heading. */
export declare function CommentComposer(props: CommentComposerProps): import("react").JSX.Element;
