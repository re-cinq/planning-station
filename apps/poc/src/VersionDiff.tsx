import { useState } from "react";
import { PlanDiffView } from "@re-cinq/planning-editor";
import type { PlanDocument } from "@re-cinq/planning-document";

import styles from "./App.module.scss";
import { planVersion, planVersions, type PlanServer } from "./plan-server.js";

interface Compared {
  before: PlanDocument;
  after: PlanDocument;
}

export function VersionDiff({ server }: { server: PlanServer }) {
  const [compared, setCompared] = useState<Compared | null>(null);

  return (
    <section className={styles.versions}>
      <button type="button" onClick={() => void load(server, setCompared)}>
        What changed in the last version
      </button>
      {compared && <PlanDiffView {...compared} />}
    </section>
  );
}

async function load(
  server: PlanServer,
  show: (compared: Compared) => void,
): Promise<void> {
  const { versions } = await planVersions(server);
  const latest = versions.at(-1)?.number ?? 1;
  const [before, after] = await Promise.all([
    planVersion(server, Math.max(latest - 1, 1)),
    planVersion(server, latest),
  ]);
  show({
    before: before.json as PlanDocument,
    after: after.json as PlanDocument,
  });
}
