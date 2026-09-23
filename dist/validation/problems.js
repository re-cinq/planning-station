export const VALIDATION_PHASES = ["draft", "approval"];
export const PROBLEM_CODES = [
    "missing-section",
    "unknown-section",
    "section-out-of-order",
    "empty-required-section",
    "missing-block",
    "too-many-blocks",
    "disallowed-block",
    "prototype-below-minimum",
];
const REQUIREMENTS_BY_PHASE = {
    draft: ["always"],
    approval: ["always", "for-approval"],
};
export function isRequiredAt(requirement, phase) {
    return REQUIREMENTS_BY_PHASE[phase].includes(requirement);
}
export function isAtLeast(phase, minimum) {
    return VALIDATION_PHASES.indexOf(phase) >= VALIDATION_PHASES.indexOf(minimum);
}
//# sourceMappingURL=problems.js.map