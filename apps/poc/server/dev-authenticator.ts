import type { CollabAuthenticator } from "@re-cinq/planning-sync";

/** The proof of concept trusts the name in the token; a host verifies a JWT. */
export function devAuthenticator(): CollabAuthenticator {
  return {
    authenticate: async (token) =>
      token ? { id: token, name: token, role: "write" } : null,
  };
}
