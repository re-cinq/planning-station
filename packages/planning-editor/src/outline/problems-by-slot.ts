import type { Problem } from "@re-cinq/planning-document";

export function problemsBySlot(
  problems: readonly Problem[],
): ReadonlyMap<string, readonly Problem[]> {
  return problems.reduce(
    (bySlot, problem) =>
      bySlot.set(problem.slot, [...(bySlot.get(problem.slot) ?? []), problem]),
    new Map<string, Problem[]>(),
  );
}
