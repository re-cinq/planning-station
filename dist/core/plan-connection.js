import { docName } from "@re-cinq/planning-document";
export async function openPlanConnection(collab, meta) {
    return collab.openDirectConnection(docName({ repo: meta.repo, planId: meta.id }));
}
/** Runs the work in one transaction on the live document and answers what it returned. */
export async function transactOn(connection, work) {
    const results = [];
    await connection.transact((document) => results.push(work(document)));
    return results[0];
}
//# sourceMappingURL=plan-connection.js.map