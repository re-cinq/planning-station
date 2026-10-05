import { BlockInserter } from './QuestionView.js';
export interface SectionPanelProps {
    block: {
        id: string;
        props: Record<string, unknown>;
    };
    editor: BlockInserter;
}
/** Each section's margin: say something about it. */
export declare function SectionPanel({ block, editor }: SectionPanelProps): import("react").JSX.Element | null;
