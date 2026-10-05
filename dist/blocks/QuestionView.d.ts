export interface BlockInserter {
    isEditable: boolean;
    insertBlocks(blocks: readonly unknown[], reference: {
        id: string;
    }, placement: "before" | "after"): unknown;
}
export interface QuestionViewProps {
    block: {
        id: string;
        props: Record<string, unknown>;
    };
    editor: BlockInserter;
    contentRef?: (node: HTMLElement | null) => void;
}
/** What the agent asked, answered by picking a suggestion or by writing one. */
export declare function QuestionView({ block, editor, contentRef }: QuestionViewProps): import("react").JSX.Element;
