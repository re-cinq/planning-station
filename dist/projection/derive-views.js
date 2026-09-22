import { blocksOfType, } from "../blocks/block-json.js";
import { plainText } from "../blocks/inline-text.js";
export function kpisOf(blocks) {
    return blocksOfType(blocks, "kpi").map(({ props, content }) => ({
        id: props.kpiId,
        metric: props.metric,
        baseline: props.baseline,
        target: props.target,
        direction: props.direction,
        deadline: props.deadline,
        rationale: plainText(content),
    }));
}
export function prototypeOf(blocks) {
    const [first] = blocksOfType(blocks, "prototype");
    return first ? toPrototype(first) : null;
}
function toPrototype({ props, content, }) {
    return {
        maturity: props.maturity,
        url: props.url,
        agreedBy: props.agreedBy,
        notes: plainText(content),
    };
}
//# sourceMappingURL=derive-views.js.map