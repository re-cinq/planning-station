import { Doc } from 'yjs';
export interface GeneratePrototypeProps {
    doc: Doc;
    slot: string;
}
/** An empty Prototype section asks the agent to draw it, when the host can. */
export declare function GeneratePrototype({ doc, slot }: GeneratePrototypeProps): import("react").JSX.Element | null;
