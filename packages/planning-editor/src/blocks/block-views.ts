import type { PlanBlockKind } from "@re-cinq/planning-document";

type Props = Readonly<Record<string, unknown>>;

/** Blocks with a view of their own, so the generic labelled view skips them. */
type UnlabelledBlock =
  | "plan-title"
  | "section-heading"
  | "section-panel"
  | "section-actions"
  | "comment"
  | "finding"
  | "question"
  | "mockup";

export interface BlockView {
  label: (props: Props) => string;
  fields: readonly string[];
  placeholder?: string;
  /** A way out to what the block points at, shown once its address is filled in. */
  link?: { text: string; href: (props: Props) => string };
}

export const BLOCK_VIEWS: Readonly<
  Record<Exclude<PlanBlockKind, UnlabelledBlock>, BlockView>
> = {
  kpi: {
    label: () => "KPI",
    fields: ["metric", "baseline", "target", "direction", "deadline"],
    placeholder: "Why this number matters",
  },
  prototype: {
    label: () => "Prototype",
    fields: ["maturity", "url", "agreedBy"],
    placeholder: "What people can try in it",
    link: {
      text: "Open prototype",
      href: (props) => String(props["url"] ?? ""),
    },
  },
  answer: {
    label: () => "Answer",
    fields: [],
    placeholder: "The decision",
  },
};
