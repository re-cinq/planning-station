import { useEffect, useMemo, type ReactNode } from "react";
import { BlockNoteView } from "@blocknote/ariakit";
import {
  templateFor,
  validatePlan,
  type PlanDocument,
  type PlanMeta,
  type PlanTemplate,
  type ValidationPhase,
  type ValidationReport,
} from "@re-cinq/planning-document";

import { AdaptersContext, type PlanEditorAdapters } from "./blocks/adapters.js";
import {
  PlanActionsContext,
  type RefineRequest,
} from "./blocks/plan-actions.js";
import { PlanSideMenu } from "./menu/PlanSideMenu.js";
import { PlanSlashMenu } from "./menu/PlanSlashMenu.js";
import { TemplateOutline } from "./outline/TemplateOutline.js";
import styles from "./PlanEditor.module.scss";
import type { PlanBlockNoteEditor } from "./schema/block-bridge.js";
import { PresenceBar } from "./presence/PresenceBar.js";
import { useTrackEditing } from "./presence/use-presence.js";
import type { PlanTransport, PlanUser } from "./session/plan-events.js";
import type { PlanSession } from "./session/plan-session.js";
import { SessionNotice } from "./session/SessionNotice.js";
import { usePlanSession, useSessionState } from "./session/use-plan-session.js";
import {
  SectionTitlesContext,
  TemplateContext,
} from "./template/template-context.js";
import { usePlanEditor } from "./use-plan-editor.js";

export interface PlanEditorProps {
  transport: PlanTransport;
  user: PlanUser;
  onChange?: (plan: PlanDocument) => void;
  template?: PlanTemplate;
  readOnly?: boolean;
  showOutline?: boolean;
  /** Drawn inside the sticky outline under its sections — the host's place for an action the outline gates, like approval. */
  outlineFooter?: ReactNode;
  showPresence?: boolean;
  validationPhase?: ValidationPhase;
  onValidation?: (report: ValidationReport) => void;
  /** A section's Refine button: hand it to the planning agent, which answers with a proposal; a rejection withdraws the ask. */
  onRefine?: (request: RefineRequest) => Promise<void>;
  adapters?: PlanEditorAdapters;
  className?: string;
}

type SessionProps = Omit<
  PlanEditorProps,
  "transport" | "adapters" | "className"
> & { session: PlanSession };

type WorkspaceProps = Omit<SessionProps, "template"> & {
  meta: PlanMeta;
  template: PlanTemplate;
};

type LayoutProps = Pick<
  WorkspaceProps,
  "template" | "readOnly" | "showOutline" | "outlineFooter" | "showPresence"
> & {
  editor: PlanBlockNoteEditor;
  awareness: PlanSession["awareness"];
  report: ValidationReport;
  sections: PlanDocument["sections"];
};

const NO_ADAPTERS: PlanEditorAdapters = {};

export function PlanEditor({
  transport,
  adapters = NO_ADAPTERS,
  className,
  ...props
}: PlanEditorProps) {
  const session = usePlanSession(transport);

  return (
    <AdaptersContext value={adapters}>
      <div className={editorClasses({ ...props, className })}>
        {session ? (
          <SessionEditor {...props} session={session} />
        ) : (
          <SessionNotice status="connecting" />
        )}
      </div>
    </AdaptersContext>
  );
}

function editorClasses({
  showOutline,
  className,
}: Pick<PlanEditorProps, "showOutline" | "className">): string {
  const layout = showOutline === false ? styles.single : styles.withOutline;

  return [styles.editor, layout, "ps-editor", className]
    .filter(Boolean)
    .join(" ");
}

function SessionEditor({ template, ...props }: SessionProps) {
  const { status, meta, reason } = useSessionState(props.session);

  if (!meta) {
    return <SessionNotice status={status} reason={reason} />;
  }

  const active = template ?? templateFor(meta.type);

  return (
    <TemplateContext value={active}>
      {status !== "ready" && <SessionNotice status={status} reason={reason} />}
      <PlanWorkspace {...props} meta={meta} template={active} />
    </TemplateContext>
  );
}

function PlanWorkspace({
  validationPhase = "approval",
  onValidation,
  onRefine,
  ...props
}: WorkspaceProps) {
  const { session, user } = props;
  const { editor, plan } = usePlanEditor(props);
  const report = usePlanValidation(plan, validationPhase, onValidation);
  const { awareness } = session;
  useTrackEditing(editor, awareness);
  const view = { ...props, editor, awareness, report, sections: plan.sections };

  return (
    <PlanActionsContext value={{ user, onRefine, doc: session.doc }}>
      <WorkspaceLayout {...view} />
    </PlanActionsContext>
  );
}

function WorkspaceLayout({
  showOutline = true,
  showPresence = true,
  ...view
}: LayoutProps) {
  const titles = useSectionTitles(view.sections);

  return (
    <SectionTitlesContext value={titles}>
      {showPresence && <PresenceBar {...view} titles={titles} />}
      <EditorSurface {...view} />
      {showOutline && <OutlinePane {...view} />}
    </SectionTitlesContext>
  );
}

// Each section's title by slot, shared by the editor's blocks and the presence bar.
function useSectionTitles(
  sections: LayoutProps["sections"],
): ReadonlyMap<string, string> {
  return useMemo(
    () => new Map(sections.map((section) => [section.slot, section.title])),
    [sections],
  );
}

function OutlinePane({
  template,
  report,
  sections,
  outlineFooter,
}: Pick<LayoutProps, "template" | "report" | "sections" | "outlineFooter">) {
  return (
    <TemplateOutline template={template} report={report} sections={sections}>
      {outlineFooter}
    </TemplateOutline>
  );
}

function EditorSurface({
  editor,
  readOnly,
}: Pick<LayoutProps, "editor" | "readOnly">) {
  return (
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      slashMenu={false}
      sideMenu={false}
    >
      <PlanSlashMenu />
      <PlanSideMenu />
    </BlockNoteView>
  );
}

function usePlanValidation(
  plan: PlanDocument,
  phase: ValidationPhase,
  onValidation?: (report: ValidationReport) => void,
): ValidationReport {
  const report = useMemo(() => validatePlan(plan, phase), [plan, phase]);
  useEffect(() => onValidation?.(report), [report, onValidation]);

  return report;
}
