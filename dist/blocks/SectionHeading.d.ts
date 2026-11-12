import { BlockInserter } from './QuestionView.js';
export interface SectionHeadingProps {
    block: {
        id: string;
        props: {
            slot: string;
            title: string;
        };
    };
    editor: BlockInserter;
}
export declare function SectionHeading({ block, editor }: SectionHeadingProps): import("react").JSX.Element;
