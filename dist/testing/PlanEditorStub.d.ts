import { BlockJson, PlanMeta } from '@re-cinq/planning-document';
export interface PlanEditorStubProps {
    meta: PlanMeta;
    initialBlocks: readonly BlockJson[];
}
export declare function PlanEditorStub({ meta, initialBlocks }: PlanEditorStubProps): import("react").JSX.Element;
