import { BlockUpdater } from './PlanBlockView.js';
interface FindingBlock {
    id: string;
    props: Record<string, unknown>;
}
export interface FindingViewProps {
    block: FindingBlock;
    editor: BlockUpdater;
    contentRef?: (node: HTMLElement | null) => void;
}
/** A finding raised on the plan; once resolved it folds to one muted line. */
export declare function FindingView({ block, editor, contentRef }: FindingViewProps): import("react").JSX.Element;
export {};
