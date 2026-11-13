import { useMemo, useState } from "react";
import { isMeaningful, partitionSections } from "@re-cinq/planning-document";
import type { Doc } from "yjs";

import { blocksOf } from "../session/doc-blocks.js";
import { useDocVersion } from "../session/use-doc-version.js";
import { usePlanActions } from "./plan-actions.js";
import styles from "./GeneratePrototype.module.scss";

const PROTOTYPE_SLOT = "prototype";
const GENERATE_NOTE =
  "The agent draws diagrams and screen sketches from this plan.";

export interface GeneratePrototypeProps {
  doc: Doc;
  slot: string;
}

/** An empty Prototype section asks the agent to draw it, when the host can. */
export function GeneratePrototype({ doc, slot }: GeneratePrototypeProps) {
  const { onGeneratePrototype } = usePlanActions();
  const holdsContent = useSectionHoldsContent(doc, slot);

  if (slot !== PROTOTYPE_SLOT || !onGeneratePrototype || holdsContent) {
    return null;
  }

  return <GenerateButton generate={onGeneratePrototype} />;
}

function GenerateButton({ generate }: { generate: () => Promise<void> }) {
  const { asking, refusal, ask } = useGenerateAsk(generate);

  return (
    <div className={styles.generate}>
      <p className={styles.bar}>
        <button
          type="button"
          className={styles.button}
          disabled={asking}
          onClick={ask}
        >
          {asking ? "Asking the agent…" : "Generate prototype"}
        </button>
        <span className={styles.note}>{GENERATE_NOTE}</span>
      </p>
      {refusal && <Refusal reason={refusal} />}
    </div>
  );
}

/** The ask is pending until the host answers; a rejection keeps its reason for the person who pressed. */
function useGenerateAsk(generate: () => Promise<void>) {
  const [asking, setAsking] = useState(false);
  const [refusal, setRefusal] = useState<string | null>(null);

  const ask = () => {
    setAsking(true);
    setRefusal(null);
    generate()
      .catch((error: unknown) => setRefusal(reasonOf(error)))
      .finally(() => setAsking(false));
  };

  return { asking, refusal, ask };
}

function Refusal({ reason }: { reason: string }) {
  return (
    <p className={styles.failed} role="alert">
      The agent cannot draw the prototype now: {reason}
    </p>
  );
}

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Judged as validation judges a section, so the button goes the moment the section reads as ready. */
function useSectionHoldsContent(doc: Doc, slot: string): boolean {
  const version = useDocVersion(doc);

  return useMemo(() => {
    const section = partitionSections(blocksOf(doc)).find(
      (candidate) => candidate.slot === slot,
    );

    return section?.blocks.some(isMeaningful) ?? false;
  }, [doc, slot, version]);
}
