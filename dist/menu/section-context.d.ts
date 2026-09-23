export interface MenuBlock {
    id: string;
    type: string;
    props: Readonly<Record<string, unknown>>;
    children: readonly MenuBlock[];
}
export declare function slotAt(blocks: readonly MenuBlock[], blockId: string): string | null;
/** The question an answer typed at this point would answer, in its section. */
export declare function questionAt(blocks: readonly MenuBlock[], blockId: string): string | null;
