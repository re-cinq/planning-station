import type { PlanTemplate } from "@re-cinq/planning-document";
import type { Awareness } from "y-protocols/awareness";

import styles from "./PresenceBar.module.scss";
import type { PresenceUser } from "./presence-users.js";
import { usePresence } from "./use-presence.js";

export interface PresenceBarProps {
  awareness: Awareness;
  template: PlanTemplate;
}

export function PresenceBar({ awareness, template }: PresenceBarProps) {
  const users = usePresence(awareness);

  return (
    <ul className={styles.bar} aria-label="Also editing">
      {users.map((user) => (
        <li key={user.clientId} className={styles.user}>
          <svg className={styles.dot} viewBox="0 0 2 2" aria-hidden="true">
            <circle cx="1" cy="1" r="1" fill={user.color} />
          </svg>
          {describe(user, template)}
        </li>
      ))}
    </ul>
  );
}

function describe(user: PresenceUser, template: PlanTemplate): string {
  const section = template.slots.find((slot) => slot.slot === user.slot);

  return section ? `${user.name} in ${section.title}` : user.name;
}
