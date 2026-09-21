export const FIELD_LABELS: Readonly<Record<string, string>> = {
  metric: "Metric",
  baseline: "Baseline",
  target: "Target",
  direction: "Direction",
  deadline: "Deadline",
  maturity: "Maturity",
  url: "Link",
  agreedBy: "Agreed by",
};

export function titleOf(
  titles: Readonly<Record<string, string>>,
  key: unknown,
): string {
  return titles[String(key)] ?? String(key);
}
