export {
  createPlanningService,
  type ApprovalRequest,
  type CreatedPlan,
  type DocumentWrite,
  type PlanningService,
} from "./core/planning-service.js";
export {
  createCollabServer,
  CollabDeniedError,
  type CollabContext,
  type CollabOptions,
} from "./core/collab-server.js";
export {
  createAgentWriter,
  AGENT_ORIGIN,
  type AgentWriter,
  type OpsRequest,
  type ProposalRequest,
} from "./core/agent-writer.js";
export { PlanNotFoundError } from "./core/errors.js";
export {
  approvalError,
  PlanNotApprovableError,
} from "./core/approval-error.js";
export { contentHash, projectPlan } from "./core/projection.js";
export type {
  CollabAuthenticator,
  PlanRole,
  Principal,
} from "./ports/authenticator.js";
export {
  VERSION_REASONS,
  type MetaPatch,
  type NewPlan,
  type PlanStore,
  type PlanVersion,
  type PlanVersionSummary,
  type StoredProjection,
  type StoredState,
  type VersionReason,
} from "./ports/plan-store.js";
export { createMemoryPlanStore, UnknownPlanError } from "./memory/index.js";
