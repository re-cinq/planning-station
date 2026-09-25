import { type BlockJson } from "../blocks/block-json.js";
export interface ReadBlock {
    id: string;
    type: string;
    hash: string;
    text: string;
    props?: Record<string, unknown>;
}
export interface ReadSection {
    slot: string;
    title: string;
    blocks: ReadBlock[];
}
export interface ReadView {
    sections: ReadSection[];
}
/** The plan as a person reads it: one section per slot, with its own blocks and their content only. */
export declare function readView(blocks: readonly BlockJson[]): ReadView;
//# sourceMappingURL=read-view.d.ts.map