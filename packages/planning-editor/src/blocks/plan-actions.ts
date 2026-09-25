import { createContext, use } from "react";
import type { RefineInputs, RefineUses } from "@re-cinq/planning-document";
import type { Doc } from "yjs";

import type { PlanUser } from "../session/plan-events.js";

/** What the host hands its agent when a person asks to refine one section. */
export interface RefineRequest {
  slot: string;
  title: string;
  /** Answered questions and resolved threads to write in; open talk to leave alone. */
  inputs: RefineInputs;
  /** The ids the proposal should report as used, so accepting it marks them. */
  uses: RefineUses;
  /** The section as it was asked about; a proposal against another state is stale. */
  baseHash: string;
}

export interface PlanActions {
  user: PlanUser;
  /** The live document, where refines wait for someone to accept them. */
  doc?: Doc;
  /** Answer by posting a proposal for the slot; a rejection withdraws the ask. */
  onRefine?: (request: RefineRequest) => Promise<void>;
}

const NOBODY: PlanUser = { id: "", name: "Someone" };

export const PlanActionsContext = createContext<PlanActions>({ user: NOBODY });

export function usePlanActions(): PlanActions {
  return use(PlanActionsContext);
}
