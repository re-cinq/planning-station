import type { PlanUser } from "@re-cinq/planning-editor";

const PEOPLE: readonly PlanUser[] = [
  { id: "ana", name: "Ana", color: "#d33682" },
  { id: "ben", name: "Ben", color: "#268bd2" },
  { id: "cleo", name: "Cleo", color: "#859900" },
  { id: "dara", name: "Dara", color: "#b58900" },
  { id: "esra", name: "Esra", color: "#6c71c4" },
];

const KEY = "planning-poc-who";
const TURN_KEY = "planning-poc-turn";

/** One person per tab: open a second tab to be someone else. */
export function whoAmI(): PlanUser {
  const remembered = sessionStorage.getItem(KEY);

  if (remembered) {
    return JSON.parse(remembered) as PlanUser;
  }

  const person = named(new URLSearchParams(location.search).get("as"));
  sessionStorage.setItem(KEY, JSON.stringify(person));

  return person;
}

function named(wanted: string | null): PlanUser {
  const asked = PEOPLE.find(
    (person) => person.name.toLowerCase() === wanted?.toLowerCase(),
  );

  return asked ?? nextInTurn();
}

/** Tabs share localStorage, so each new tab takes the next person in turn. */
function nextInTurn(): PlanUser {
  const turn = Number(localStorage.getItem(TURN_KEY) ?? 0);
  localStorage.setItem(TURN_KEY, String(turn + 1));

  return PEOPLE[turn % PEOPLE.length] ?? PEOPLE[0]!;
}
