export interface ColorClaim {
  clientId: number;
  userId: string;
  joinedAt: number;
  /** The color the peer announces now; kept when no one who joined earlier holds it, so nobody is recolored when someone leaves. */
  color?: string;
}

// Hues a golden angle apart in three saturation/lightness bands, each dimmed until white label text reads on it.
export const PALETTE: readonly string[] = [
  "#c32222",
  "#278643",
  "#9213ec",
  "#827517",
  "#287a8a",
  "#e21283",
  "#338618",
  "#2c288a",
  "#cb4f10",
  "#18865d",
  "#82288a",
  "#677f0a",
  "#2272c3",
  "#8a283c",
  "#0b8916",
  "#5f22c3",
  "#8a6a28",
  "#0b847f",
  "#c3229b",
  "#508226",
  "#1337ec",
  "#c33722",
  "#27864f",
  "#ad13ec",
  "#797915",
  "#286d8a",
  "#e21268",
  "#258618",
  "#39288a",
  "#b85d0f",
  "#18866b",
  "#8a2886",
  "#587f0a",
  "#225ec3",
  "#8a2830",
  "#0b8926",
  "#7422c3",
  "#867327",
  "#0b828e",
  "#c32286",
  "#448226",
  "#131bec",
  "#c34b22",
  "#27865b",
  "#c513e7",
  "#6c7915",
  "#28618a",
  "#e7134f",
  "#188618",
  "#45288a",
];

export function assignColors(
  claims: readonly ColorClaim[],
): Map<string, string> {
  const colors = new Map<string, string>();

  for (const claim of [...claims].sort(holdersFirst)) {
    if (!colors.has(claim.userId)) {
      colors.set(claim.userId, pick(claim.color, [...colors.values()]));
    }
  }

  return colors;
}

// Whoever already holds a palette color settles before a newcomer, so a newcomer's clock never recolors the plan.
function holdersFirst(first: ColorClaim, second: ColorClaim): number {
  return (
    Number(holdsColor(second)) - Number(holdsColor(first)) ||
    first.joinedAt - second.joinedAt ||
    first.clientId - second.clientId
  );
}

function holdsColor({ color }: ColorClaim): boolean {
  return color !== undefined && PALETTE.includes(color);
}

function pick(announced: string | undefined, taken: readonly string[]): string {
  const free = PALETTE.filter((color) => !taken.includes(color));

  if (announced && free.includes(announced)) {
    return announced;
  }

  return free[0] ?? PALETTE[taken.length % PALETTE.length]!;
}
