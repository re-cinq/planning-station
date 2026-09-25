import type { Document, Hocuspocus } from "@hocuspocus/server";
import { docName, type PlanMeta } from "@re-cinq/planning-document";

/** A server-side connection to one plan's live document. */
export type PlanConnection = Awaited<
  ReturnType<Hocuspocus["openDirectConnection"]>
>;

export async function openPlanConnection(
  collab: Hocuspocus,
  meta: PlanMeta,
): Promise<PlanConnection> {
  return collab.openDirectConnection(
    docName({ repo: meta.repo, planId: meta.id }),
  );
}

/** Runs the work in one transaction on the live document and answers what it returned. */
export async function transactOn<Result>(
  connection: PlanConnection,
  work: (document: Document) => Result,
): Promise<Result> {
  const results: Result[] = [];

  await connection.transact((document) => results.push(work(document)));

  return results[0] as Result;
}
