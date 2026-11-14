import { type BlockJson } from "../blocks/block-json.js";
import { type Check } from "./problems.js";
export declare const missingSections: Check;
export declare const unknownSections: Check;
export declare const sectionOrder: Check;
export declare const disallowedBlocks: Check;
export declare const emptyRequiredSections: Check;
export declare const blockRequirements: Check;
/** Whether a block is content a section is judged by: a plan block, or prose with text. */
export declare function isMeaningful(block: BlockJson): boolean;
//# sourceMappingURL=section-checks.d.ts.map