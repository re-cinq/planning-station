import { PlanBlockKind } from '@re-cinq/planning-document';
type Props = Readonly<Record<string, unknown>>;
/** Blocks with a view of their own, so the generic labelled view skips them. */
type UnlabelledBlock = "plan-title" | "section-heading" | "section-panel" | "section-actions" | "comment" | "finding" | "question" | "mockup";
export interface BlockView {
    label: (props: Props) => string;
    fields: readonly string[];
    placeholder?: string;
    /** A way out to what the block points at, shown once its address is filled in. */
    link?: {
        text: string;
        href: (props: Props) => string;
    };
}
export declare const BLOCK_VIEWS: Readonly<Record<Exclude<PlanBlockKind, UnlabelledBlock>, BlockView>>;
export {};
