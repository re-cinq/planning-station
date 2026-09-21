import { useId, type ChangeEvent } from "react";

import { FIELD_LABELS, titleOf } from "./labels.js";
import styles from "./PropField.module.scss";

export interface PropSpec {
  default: string | number | boolean;
  values?: readonly string[];
}

export interface PropFieldProps {
  name: string;
  spec: PropSpec;
  value: unknown;
  onChange: (value: string | number | boolean) => void;
  readOnly: boolean;
}

type InputProps = Omit<PropFieldProps, "name"> & { id: string };

export function PropField({ name, ...input }: PropFieldProps) {
  const id = useId();

  return (
    <span className={styles.field} data-field={name}>
      <label className={styles.label} htmlFor={id}>
        {titleOf(FIELD_LABELS, name)}
      </label>
      <FieldInput {...input} id={id} />
    </span>
  );
}

function FieldInput(props: InputProps) {
  return props.spec.values ? (
    <SelectInput {...props} values={props.spec.values} />
  ) : (
    <TextInput {...props} />
  );
}

function SelectInput({
  id,
  value,
  values,
  onChange,
  readOnly,
}: InputProps & { values: readonly string[] }) {
  return (
    <select
      id={id}
      value={String(value)}
      disabled={readOnly}
      onChange={(event) => onChange(event.target.value)}
    >
      {values.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function TextInput({ id, spec, value, onChange, readOnly }: InputProps) {
  const numeric = typeof spec.default === "number";
  const read = (event: ChangeEvent<HTMLInputElement>) =>
    numeric ? Number(event.target.value) : event.target.value;

  return (
    <input
      id={id}
      className={styles.input}
      type={numeric ? "number" : "text"}
      value={String(value ?? "")}
      readOnly={readOnly}
      onChange={(event) => onChange(read(event))}
    />
  );
}
