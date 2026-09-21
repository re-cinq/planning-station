import { useId } from "react";

import styles from "./MaturitySteps.module.scss";
import type { PropFieldProps } from "./PropField.js";

const STEP_LABELS: Readonly<Record<string, string>> = {
  none: "Nothing yet",
  "click-dummy": "Click-dummy",
  "running-prototype": "Running prototype",
  "pre-prod": "Pre-prod",
};

/** A prototype matures in order, so its maturity reads as steps: the ones behind it are reached. */
export function MaturitySteps({
  spec,
  value,
  onChange,
  readOnly,
}: PropFieldProps) {
  const group = useId();
  const steps = spec.values ?? [];
  const reached = steps.indexOf(String(value));
  const fieldset = { className: styles.steps, disabled: readOnly };

  return (
    <fieldset {...fieldset} data-field="maturity">
      <legend className={styles.legend}>Maturity</legend>
      {steps.map((step, index) => (
        <Step key={step} {...{ group, step, onChange }} at={index - reached} />
      ))}
    </fieldset>
  );
}

interface StepProps extends Pick<PropFieldProps, "onChange"> {
  group: string;
  step: string;
  /** Where the step stands against the current one: behind is negative, the current one is 0. */
  at: number;
}

function Step({ group, step, at, onChange }: StepProps) {
  return (
    <label className={styles.step} data-reached={at <= 0 || undefined}>
      <input
        type="radio"
        name={group}
        value={step}
        checked={at === 0}
        onChange={() => onChange(step)}
      />
      {STEP_LABELS[step] ?? step}
    </label>
  );
}
