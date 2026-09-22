import { Doc } from 'yjs';
export interface RefineControlsProps {
    doc: Doc;
    slot: string;
    title: string;
}
/** Ask the agent for one section, then accept or discard what it proposes. */
export declare function RefineControls(props: RefineControlsProps): import("react").JSX.Element;
