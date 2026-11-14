import { type BlockJson } from "../blocks/block-json.js";
import type { InlineContent } from "../blocks/inline-text.js";
type StyledText = Extract<InlineContent[number], {
    type: "text";
}>;
export declare function styledText(value: string, ...styles: string[]): StyledText;
/** A feature plan whose prose uses every prose block and every mark plan.md writes, a level 2 heading and a nested list among them. */
export declare function richFeature(): BlockJson[];
export {};
//# sourceMappingURL=rich-prose.d.ts.map