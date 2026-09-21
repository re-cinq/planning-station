import { createElement, type FunctionComponent } from "react";
import { PLAN_BLOCK_CONFIGS } from "@re-cinq/planning-document";

import { BLOCK_VIEWS, type BlockView } from "./block-views.js";
import { MaturitySteps } from "./MaturitySteps.js";
import styles from "./PlanBlockView.module.scss";
import { PropField, type PropFieldProps, type PropSpec } from "./PropField.js";

/** Fields that read better as something other than a labelled input. */
const FIELD_INPUTS: Readonly<
  Record<string, FunctionComponent<PropFieldProps>>
> = { maturity: MaturitySteps };

export interface BlockUpdater {
  isEditable: boolean;
  updateBlock(
    block: { id: string },
    update: { props: Record<string, unknown> },
  ): unknown;
}

export interface PlanBlockViewProps {
  block: { id: string; type: string; props: Record<string, unknown> };
  editor: BlockUpdater;
  contentRef?: (node: HTMLElement | null) => void;
}

type ViewKind = keyof typeof BLOCK_VIEWS;

export function PlanBlockView({
  block,
  editor,
  contentRef,
}: PlanBlockViewProps) {
  const view = BLOCK_VIEWS[block.type as ViewKind];

  return (
    <div className={styles.block} data-kind={block.type}>
      <BlockFields block={block} editor={editor} view={view} />
      {contentRef && (
        <div
          className={styles.content}
          ref={contentRef}
          data-placeholder={view.placeholder}
        />
      )}
    </div>
  );
}

type BoundProps = Omit<PlanBlockViewProps, "contentRef">;

function BlockFields({
  block,
  editor,
  view,
}: BoundProps & { view: BlockView }) {
  const readOnly = !editor.isEditable;

  return (
    <div className={styles.meta} contentEditable={false}>
      <p className={styles.head}>
        <span className={styles.label}>{view.label(block.props)}</span>
        <LinkOut view={view} props={block.props} />
      </p>
      {view.fields.map((name) => (
        <BoundField key={name} {...{ block, editor, name, readOnly }} />
      ))}
    </div>
  );
}

function LinkOut({
  view,
  props,
}: {
  view: BlockView;
  props: PlanBlockViewProps["block"]["props"];
}) {
  const href = view.link?.href(props) ?? "";

  return (
    href && (
      <a className={styles.link} href={href} target="_blank" rel="noreferrer">
        {view.link?.text} <span aria-hidden="true">↗</span>
      </a>
    )
  );
}

function BoundField({
  block,
  editor,
  name,
  readOnly,
}: BoundProps & { name: string; readOnly: boolean }) {
  const { propSchema } = PLAN_BLOCK_CONFIGS[block.type as ViewKind];
  const specs = propSchema as Readonly<Record<string, PropSpec>>;

  return createElement(FIELD_INPUTS[name] ?? PropField, {
    name,
    spec: specs[name] ?? { default: "" },
    value: block.props[name],
    readOnly,
    onChange: (value) =>
      editor.updateBlock(block, { props: { [name]: value } }),
  });
}
