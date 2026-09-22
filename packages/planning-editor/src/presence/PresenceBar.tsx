import type { PlanTemplate } from "@re-cinq/planning-document";
import type { Awareness } from "y-protocols/awareness";

import styles from "./PresenceBar.module.scss";
import { presenceLabel } from "./presence-users.js";
import { usePresence } from "./use-presence.js";

export interface PresenceBarProps {
  awareness: Awareness;
  template: PlanTemplate;
  /** Each section's title by slot, so a section the agent added reads by its name. */
  titles: ReadonlyMap<string, string>;
}

export function PresenceBar({ awareness, template, titles }: PresenceBarProps) {
  const users = usePresence(awareness);

  return (
    <ul className={styles.bar} aria-label="Also editing">
      {users.map((user) => (
        <li key={user.clientId} className={styles.user}>
          <svg className={styles.dot} viewBox="0 0 2 2" aria-hidden="true">
            <circle cx="1" cy="1" r="1" fill={user.color} />
          </svg>
          {presenceLabel(user, template, titles)}
        </li>
      ))}
    </ul>
  );
}
