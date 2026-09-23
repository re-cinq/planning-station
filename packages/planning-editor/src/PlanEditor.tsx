import { useEffect, useMemo, type ReactNode } from "react";
import type { Doc } from "yjs";
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
import { InlineChanges } from "./blocks/InlineChanges.js";
import type { ChangeHosts } from "./blocks/change-hosts.js";
import { PlanSideMenu } from "./menu/PlanSideMenu.js";
import { PlanSlashMenu } from "./menu/PlanSlashMenu.js";
import { TemplateOutline } from "./outline/TemplateOutline.js";
import styles from "./PlanEditor.module.scss";
import type { PlanBlockNoteEditor } from "./schema/block-bridge.js";
import { Participants } from "./presence/Participants.js";
import { scrollToCursor } from "./presence/scroll-to-cursor.js";
import { useTrackEditing } from "./presence/use-presence.js";
import type { PlanTransport, PlanUser } from "./session/plan-events.js";
import type { PlanSession } from "./session/plan-session.js";
import { SessionNotice } from "./session/SessionNotice.js";
import { usePlanChanges } from "./session/use-plan-changes.js";
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
  doc: Doc;
  hosts: ChangeHosts;
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
  showPresence,
  className,
}: Pick<
  PlanEditorProps,
  "showOutline" | "showPresence" | "className"
>): string {
  const sidebar = showOutline !== false || showPresence !== false;
  const layout = sidebar ? styles.withSidebar : styles.single;

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
  const { editor, plan, hosts } = usePlanEditor(props);
  const live = editing(session, editor, hosts);
  const report = usePlanValidation(plan, validationPhase, onValidation);
  useTrackEditing(editor, session.awareness);

  return (
    <PlanActionsContext value={{ user, onRefine, doc: session.doc }}>
      <WorkspaceLayout {...props} {...live} {...plan} report={report} />
    </PlanActionsContext>
  );
}

/** What the layout reads about the live document: the editor, the plan's own doc, where a change hangs, and who else is here. */
function editing(
  session: PlanSession,
  editor: PlanBlockNoteEditor,
  hosts: ChangeHosts,
) {
  return {
    editor,
    hosts,
    doc: session.doc,
    awareness: session.awareness,
  };
}

function WorkspaceLayout({
  showOutline = true,
  showPresence = true,
  ...view
}: LayoutProps) {
  const titles = useSectionTitles(view.sections);

  const panes = { showPresence, showOutline };

  return (
    <SectionTitlesContext value={titles}>
      <EditorSurface {...view} />
      <Sidebar {...view} {...panes} titles={titles} />
    </SectionTitlesContext>
  );
}

type SidebarProps = Omit<LayoutProps, "showPresence" | "showOutline"> & {
  showPresence: boolean;
  showOutline: boolean;
  titles: ReadonlyMap<string, string>;
};

// Participants sit above the outline so a name can be followed to its cursor while the outline stays put.
function Sidebar({ showPresence, showOutline, ...view }: SidebarProps) {
  if (!showPresence && !showOutline) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      {showPresence && <ParticipantsPane {...view} />}
      {showOutline && <OutlinePane {...view} />}
    </aside>
  );
}

// Each section's title by slot, shared by the editor's blocks and the participants list.
function useSectionTitles(
  sections: LayoutProps["sections"],
): ReadonlyMap<string, string> {
  return useMemo(
    () => new Map(sections.map((section) => [section.slot, section.title])),
    [sections],
  );
}

function ParticipantsPane({
  editor,
  awareness,
  template,
  titles,
}: Pick<LayoutProps, "editor" | "awareness" | "template"> & {
  titles: ReadonlyMap<string, string>;
}) {
  return (
    <Participants
      awareness={awareness}
      template={template}
      titles={titles}
      onLocate={(user) => scrollToCursor(editor, user.clientId)}
    />
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
  doc,
  hosts,
}: Pick<LayoutProps, "editor" | "readOnly" | "doc" | "hosts">) {
  const changes = usePlanChanges(doc, () => redraw(editor));

  return (
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      slashMenu={false}
      sideMenu={false}
    >
      <PlanSlashMenu />
      <PlanSideMenu />
      <InlineChanges changes={changes} hosts={hosts} />
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

/** A transaction that changes nothing, so ProseMirror recomputes its decorations and a change proposed just now gets its place; queued because dispatching inside the update that prompted it re-enters the editor mid-apply. */
function redraw(editor: PlanBlockNoteEditor): void {
  queueMicrotask(() => {
    const view = editor.prosemirrorView;

    if (!view.isDestroyed) {
      view.dispatch(view.state.tr);
    }
  });
}
