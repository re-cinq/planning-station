import { enforceTrue } from "../lib/enforce.js";

export const PLAN_FRAGMENT = "document-store";

export class DocNameError extends Error {}

export interface ParsedDocName {
  repo: string;
  planId: string;
}

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const SEGMENT = "[A-Za-z0-9_.-]+";
const DOC_NAME = new RegExp(`^plan:(${SEGMENT}/${SEGMENT}):(${UUID})$`);

export function docName(parts: ParsedDocName): string {
  const name = `plan:${parts.repo}:${parts.planId}`;
  enforceTrue(
    DOC_NAME.test(name),
    DocNameError,
    `invalid plan document parts ${parts.repo} ${parts.planId}`,
  );

  return name;
}

export function parseDocName(name: string): ParsedDocName {
  const match = DOC_NAME.exec(name);
  enforceTrue(match, DocNameError, `invalid plan document name ${name}`);

  return { repo: match[1] ?? "", planId: match[2] ?? "" };
}
