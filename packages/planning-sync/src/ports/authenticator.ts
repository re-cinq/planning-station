import type { ParsedDocName } from "@re-cinq/planning-document";

export type PlanRole = "read" | "write";

export interface Principal {
  id: string;
  name: string;
  role: PlanRole;
}

/** The host decides who may open a plan; this library never verifies tokens. */
export interface CollabAuthenticator {
  authenticate(token: string, doc: ParsedDocName): Promise<Principal | null>;
}
