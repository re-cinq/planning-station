export interface SectionActionsProps {
    block: {
        props: Record<string, unknown>;
    };
    editor: {
        isEditable: boolean;
    };
}
/** Closes each section, under its questions: ask the agent to work on it. */
export declare function SectionActions({ block, editor }: SectionActionsProps): import("react").JSX.Element | null;
