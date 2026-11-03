import type { InlineContent } from "../blocks/inline-text.js";
/** Inline nodes as canonical Markdown: `**`, `*`, `~~`, backticks and `[text](href)`, with literal syntax escaped so it reads back as the same nodes. */
export declare function renderInline(content: InlineContent): string;
/** Only the styles Markdown can say, with no style opening on or closing after a space, so the markers stay readable. */
export declare function canonicalInline(content: InlineContent): InlineContent;
//# sourceMappingURL=inline-render.d.ts.map