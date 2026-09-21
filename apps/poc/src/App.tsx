import { useState } from "react";
import { PlanEditor, type PlanUser } from "@re-cinq/planning-editor";
import type { PlanDocument } from "@re-cinq/planning-document";

import styles from "./App.module.scss";
import { PlanActions, refineSection } from "./PlanActions.js";
import { usePlanServer, type PlanServer } from "./plan-server.js";
import { usePlanTransport } from "./use-plan-transport.js";
import { VersionDiff } from "./VersionDiff.js";
import { whoAmI } from "./who.js";

export function App() {
  const server = usePlanServer();
  const [user] = useState(whoAmI);
  const [plan, setPlan] = useState<PlanDocument | null>(null);

  if (!server) {
    return <main className={styles.page}>Waiting for the plan server…</main>;
  }

  return (
    <main className={styles.page}>
      <PlanHeader user={user} />
      <PlanActions server={server} />
      <ThePlan server={server} user={user} onChange={setPlan} />
      <VersionDiff server={server} />
      <PlanJson plan={plan} />
    </main>
  );
}

interface ThePlanProps {
  server: PlanServer;
  user: PlanUser;
  onChange: (plan: PlanDocument) => void;
}

function ThePlan({ server, user, onChange }: ThePlanProps) {
  const transport = usePlanTransport(server, user.id);

  return (
    transport && (
      <PlanEditor
        transport={transport}
        user={user}
        onChange={onChange}
        onRefine={(request) => refineSection(server, request)}
      />
    )
  );
}

function PlanHeader({ user }: { user: PlanUser }) {
  return (
    <header className={styles.header}>
      <p className={styles.who}>
        You are <strong className={styles.name}>{user.name}</strong> in this
        tab. Open another tab to be someone else.
      </p>
      <SchemeToggle />
    </header>
  );
}

/** The editor follows the host's scheme; this proves it from the host's side. */
function SchemeToggle() {
  const [dark, setDark] = useState(false);

  const flip = () => {
    document.documentElement.dataset.colorScheme = dark ? "light" : "dark";
    setDark(!dark);
  };

  return (
    <button type="button" onClick={flip}>
      {dark ? "Light theme" : "Dark theme"}
    </button>
  );
}

function PlanJson({ plan }: { plan: PlanDocument | null }) {
  return (
    <details className={styles.json}>
      <summary>Plan document JSON</summary>
      <pre>{JSON.stringify(plan, null, 2)}</pre>
    </details>
  );
}
