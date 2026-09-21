import type {
  Approval,
  PlanDocument,
  PlanKind,
  PlanMeta,
  PlanStatus,
} from "@re-cinq/planning-document";

export const VERSION_REASONS = [
  "publish",
  "approval",
  "agent-write",
  "restore",
  "auto",
] as const;

export type VersionReason = (typeof VERSION_REASONS)[number];

export interface NewPlan {
  repo: string;
  title: string;
  type: PlanKind;
  createdBy: string;
}

export interface MetaPatch {
  title?: string;
  status?: PlanStatus;
  approval?: Approval | null;
  version?: number;
}

export interface StoredState {
  planId: string;
  state: Uint8Array;
  json: PlanDocument;
  contentHash: string;
}

export interface StoredProjection {
  json: PlanDocument;
  contentHash: string;
  version: number;
}

export interface PlanVersion {
  planId: string;
  number: number;
  reason: VersionReason;
  createdBy: string;
  createdAt: string;
  contentHash: string;
  json: PlanDocument;
  state: Uint8Array;
}

export type PlanVersionSummary = Omit<PlanVersion, "json" | "state">;

/** The one persistence port: a host implements it on its own database. */
export interface PlanStore {
  createPlan(input: NewPlan): Promise<PlanMeta>;
  getMeta(planId: string): Promise<PlanMeta | null>;
  updateMeta(planId: string, patch: MetaPatch): Promise<PlanMeta>;
  loadState(planId: string): Promise<Uint8Array | null>;
  storeState(input: StoredState): Promise<void>;
  loadProjection(planId: string): Promise<StoredProjection | null>;
  appendVersion(version: PlanVersion): Promise<void>;
  listVersions(planId: string): Promise<PlanVersionSummary[]>;
  getVersion(planId: string, number: number): Promise<PlanVersion | null>;
}
