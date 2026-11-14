export interface BlockUpdater {
    isEditable: boolean;
    updateBlock(block: {
        id: string;
    }, update: {
        props: Record<string, unknown>;
    }): unknown;
}
export interface PlanBlockViewProps {
    block: {
        id: string;
        type: string;
        props: Record<string, unknown>;
    };
    editor: BlockUpdater;
    contentRef?: (node: HTMLElement | null) => void;
}
export declare function PlanBlockView({ block, editor, contentRef, }: PlanBlockViewProps): import("react").JSX.Element;
