import type { PlanTemplate } from "@re-cinq/planning-document";
import type { Awareness } from "y-protocols/awareness";

import styles from "./Participants.module.scss";
import { presenceLabel, type PresenceUser } from "./presence-users.js";
import { usePresence } from "./use-presence.js";

export interface ParticipantsProps {
  awareness: Awareness;
  template: PlanTemplate;
  /** Each section's title by slot, so a section the agent added reads by its name. */
  titles: ReadonlyMap<string, string>;
  /** A participant's name was clicked; only offered for one whose cursor is in the document. */
  onLocate: (user: PresenceUser) => void;
}

export function Participants({ awareness, ...entry }: ParticipantsProps) {
  const users = usePresence(awareness);

  if (users.length === 0) {
    return null;
  }

  return (
    <ul className={styles.participants} aria-label="Participants">
      {users.map((user) => (
        <li key={user.clientId}>
          <Participant user={user} {...entry} />
        </li>
      ))}
    </ul>
  );
}

type ParticipantProps = Omit<ParticipantsProps, "awareness"> & {
  user: PresenceUser;
};

function Participant({ user, template, titles, onLocate }: ParticipantProps) {
  const label = presenceLabel(user, template, titles);

  return user.hasCursor ? (
    <button
      type="button"
      className={styles.locate}
      aria-description={`Go to ${user.name}'s cursor`}
      onMouseDown={keepFocus}
      onClick={() => onLocate(user)}
    >
      <Entry color={user.color} label={label} />
    </button>
  ) : (
    <span className={styles.away}>
      <Entry color={user.color} label={label} />
    </span>
  );
}

/** Locating someone is a glance, not a move: the caret stays where the reader was typing. */
function keepFocus(event: { preventDefault(): void }): void {
  event.preventDefault();
}

function Entry({ color, label }: { color: string; label: string }) {
  return (
    <>
      <svg className={styles.dot} viewBox="0 0 2 2" aria-hidden="true">
        <circle cx="1" cy="1" r="1" fill={color} />
      </svg>
      {label}
    </>
  );
}
