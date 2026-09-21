import { useEffect, useState } from "react";
import type { AgentOp, PlanMeta, RefineUses } from "@re-cinq/planning-document";

export interface PlanServer {
  documentName: string;
  meta: PlanMeta;
  wsUrl: string;
  apiUrl: string;
}

const DEV_PLAN = "http://localhost:1234/dev/plan";
const TIMEOUT_MS = 5000;

export function usePlanServer(): PlanServer | null {
  const [server, setServer] = useState<PlanServer | null>(null);

  useEffect(() => {
    fetch(DEV_PLAN, { signal: AbortSignal.timeout(TIMEOUT_MS) })
      .then((response) => response.json())
      .then(setServer)
      .catch(() => setServer(null));
  }, []);

  return server;
}

export function agentWrites(server: PlanServer, ops: AgentOp[]): Promise<void> {
  return post(server, "agent-edits", { actor: "planning-agent", ops });
}

export interface Proposal {
  slot: string;
  baseHash: string;
  ops: AgentOp[];
  uses: RefineUses;
}

export function agentProposes(
  server: PlanServer,
  proposal: Proposal,
): Promise<void> {
  return post(server, "proposals", { actor: "planning-agent", ...proposal });
}

export function planVersions(server: PlanServer): Promise<{
  versions: { number: number }[];
}> {
  return read(server, "versions");
}

export function planVersion(
  server: PlanServer,
  number: number,
): Promise<{ json: unknown }> {
  return read(server, `versions/${number}`);
}

async function post(
  server: PlanServer,
  route: string,
  payload: unknown,
): Promise<void> {
  await fetch(`${server.apiUrl}/${server.meta.id}/${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

async function read<Answer>(
  server: PlanServer,
  route: string,
): Promise<Answer> {
  const response = await fetch(`${server.apiUrl}/${server.meta.id}/${route}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  return response.json() as Promise<Answer>;
}
