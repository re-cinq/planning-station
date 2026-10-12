import { templateFor } from "../template/templates.js";
import { blockRequirements, disallowedBlocks, emptyRequiredSections, missingSections, sectionOrder, unknownSections, } from "./section-checks.js";
import { unresolvedFindings } from "./finding-check.js";
import { prototypeMinimum } from "./prototype-check.js";
const CHECKS = [
    missingSections,
    unknownSections,
    sectionOrder,
    disallowedBlocks,
    emptyRequiredSections,
    blockRequirements,
    prototypeMinimum,
    unresolvedFindings,
];
export function validatePlan(plan, phase) {
    const template = templateFor(plan.type);
    const problems = CHECKS.flatMap((check) => check({ plan, template, phase }));
    return { passed: problems.length === 0, phase, problems };
}
//# sourceMappingURL=validate-plan.js.map