import "@blocknote/ariakit/style.css";
import "./styles/theme.scss";

export { PlanEditor, type PlanEditorProps } from "./PlanEditor.js";
export type {
  InboundPlanEvent,
  OutboundPlanEvent,
  PlanTransport,
  PlanUser,
  TransportStatus,
} from "./session/plan-events.js";
export {
  createMemoryHub,
  localTransport,
  type MemoryHub,
  type PlanSeed,
} from "./session/memory-hub.js";
export {
  transportFor,
  type PlanProvider,
  type ProviderTransport,
} from "./transports/plan-provider.js";
export { PlanDiffView, type PlanDiffViewProps } from "./diff/PlanDiffView.js";
export type { PresenceUser } from "./presence/presence-users.js";
export { planSchema, type PlanSchema } from "./schema/plan-schema.js";
export {
  fromEditorBlocks,
  projectBlocks,
  type PlanPartialBlock,
} from "./schema/block-bridge.js";
export { bypassTemplate } from "./template/template-guard.js";
export type { Mockup, PlanEditorAdapters } from "./blocks/adapters.js";
export type { RefineRequest } from "./blocks/plan-actions.js";
