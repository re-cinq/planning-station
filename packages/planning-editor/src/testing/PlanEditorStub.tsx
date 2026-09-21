import {
  plainText,
  toPlanDocument,
  type BlockJson,
  type PlanMeta,
} from "@re-cinq/planning-document";

export interface PlanEditorStubProps {
  meta: PlanMeta;
  initialBlocks: readonly BlockJson[];
}

export function PlanEditorStub({ meta, initialBlocks }: PlanEditorStubProps) {
  const plan = toPlanDocument(initialBlocks, meta);

  return (
    <article aria-label={plan.title}>
      {plan.sections.map((section) => (
        <section key={section.headingId} aria-label={section.title}>
          <h2>{section.title}</h2>
          {section.blocks.map((block) => (
            <p key={block.id}>{textOf(block)}</p>
          ))}
        </section>
      ))}
    </article>
  );
}

function textOf(block: BlockJson): string {
  return Array.isArray(block.content) ? plainText(block.content) : "";
}
