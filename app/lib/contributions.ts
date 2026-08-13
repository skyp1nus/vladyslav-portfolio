/**
 * GitHub contribution calendar, fetched client-side from a public mirror
 * (GitHub itself exposes the calendar only via authenticated GraphQL).
 * If this endpoint ever dies: fetch it in CI with a read:user PAT and bake
 * the JSON into public/ instead.
 */
const ENDPOINT = (user: string) =>
  `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`;

const CACHE_KEY = (user: string) => `gh-contrib:${user}:v1`;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

export type Level = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: Level;
}

export interface ContributionsResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

export interface Cell {
  day: ContributionDay | null;
}

export interface MonthLabel {
  col: number;
  label: string;
}

export interface ContributionStats {
  total: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: ContributionDay | null;
  activeDays: number;
}

export interface GraphModel {
  cells: Cell[];
  columns: number;
  months: MonthLabel[];
  stats: ContributionStats;
  summary: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* UTC everywhere: getDay() would report the previous weekday west of UTC
   and shift the whole grid one row. */
function isoToUtc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

const FMT_LONG = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const FMT_MEDIUM = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatFull = (iso: string) => FMT_LONG.format(isoToUtc(iso));
export const formatLong = (iso: string) => FMT_MEDIUM.format(isoToUtc(iso));
export const formatNumber = (n: number) => n.toLocaleString("en-US");

export function readCache(user: string): ContributionsResponse | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY(user));
    if (!raw) return null;
    const { t, payload } = JSON.parse(raw) as {
      t: number;
      payload: ContributionsResponse;
    };
    if (!t || Date.now() - t > CACHE_TTL_MS) return null;
    return payload;
  } catch {
    return null;
  }
}

export function writeCache(user: string, payload: ContributionsResponse) {
  try {
    sessionStorage.setItem(
      CACHE_KEY(user),
      JSON.stringify({ t: Date.now(), payload })
    );
  } catch {
    /* private mode or quota — the graph works without a cache */
  }
}

export async function fetchContributions(
  user: string
): Promise<ContributionsResponse> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT(user), {
      signal: ac.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`contributions: HTTP ${res.status}`);
    const json = (await res.json()) as Partial<ContributionsResponse> & {
      error?: string;
    };
    // An unknown user comes back as 200 with an `error` key.
    if (
      json.error ||
      !Array.isArray(json.contributions) ||
      json.contributions.length === 0
    ) {
      throw new Error("contributions: unexpected payload");
    }
    return json as ContributionsResponse;
  } finally {
    clearTimeout(timer);
  }
}

export function buildCells(days: ContributionDay[]): {
  cells: Cell[];
  columns: number;
} {
  if (days.length === 0) return { cells: [], columns: 0 };

  const leading = new Date(isoToUtc(days[0].date)).getUTCDay();
  const cells: Cell[] = Array.from({ length: leading }, () => ({ day: null }));

  for (const d of days) {
    cells.push({
      day: {
        date: d.date,
        count: Number(d.count) || 0,
        level: Math.min(4, Math.max(0, Number(d.level) || 0)) as Level,
      },
    });
  }

  const columns = Math.ceil(cells.length / 7);
  while (cells.length < columns * 7) cells.push({ day: null });

  return { cells, columns };
}

export function buildMonthLabels(cells: Cell[], columns: number): MonthLabel[] {
  const out: MonthLabel[] = [];
  let lastMonth = -1;
  let lastLabelCol = -Infinity;

  for (let col = 0; col < columns; col++) {
    let first: ContributionDay | null = null;
    for (let row = 0; row < 7; row++) {
      const d = cells[col * 7 + row]?.day;
      if (d) {
        first = d;
        break;
      }
    }
    if (!first) continue;

    const month = new Date(isoToUtc(first.date)).getUTCMonth();
    if (month === lastMonth) continue;
    lastMonth = month;

    // Keep 3 columns of clearance so labels never collide, and never label
    // the last columns — the text would spill past the grid's right edge.
    if (col - lastLabelCol < 3 || col > columns - 3) continue;

    out.push({ col, label: MONTHS[month] });
    lastLabelCol = col;
  }

  return out;
}

export function computeStats(
  days: ContributionDay[],
  total: number
): ContributionStats {
  let longest = 0;
  let run = 0;
  let active = 0;
  let best: ContributionDay | null = null;

  for (const d of days) {
    if (d.count > 0) {
      run++;
      active++;
      if (run > longest) longest = run;
      if (!best || d.count > best.count) best = d;
    } else {
      run = 0;
    }
  }

  // Today may legitimately be 0 because the day isn't over — tolerate one
  // trailing zero, else the streak reads 0 every morning.
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;

  return {
    total,
    currentStreak: current,
    longestStreak: longest,
    bestDay: best,
    activeDays: active,
  };
}

function resolveTotal(raw: ContributionsResponse, days: ContributionDay[]) {
  const fromKey = raw.total?.lastYear;
  if (typeof fromKey === "number") return fromKey;
  const firstValue = Object.values(raw.total ?? {})[0];
  if (typeof firstValue === "number") return firstValue;
  return days.reduce((sum, d) => sum + d.count, 0);
}

export function buildModel(raw: ContributionsResponse): GraphModel {
  const days = raw.contributions;
  const total = resolveTotal(raw, days);
  const { cells, columns } = buildCells(days);
  const stats = computeStats(days, total);

  const parts = [
    `${formatNumber(total)} contributions between ${formatLong(
      days[0].date
    )} and ${formatLong(days[days.length - 1].date)}.`,
    `Active on ${formatNumber(stats.activeDays)} of ${formatNumber(
      days.length
    )} days.`,
    `Longest streak ${stats.longestStreak} days, current streak ${stats.currentStreak} days.`,
  ];
  if (stats.bestDay) {
    parts.push(
      `Most active day: ${formatLong(stats.bestDay.date)} with ${formatNumber(
        stats.bestDay.count
      )} contributions.`
    );
  }

  return {
    cells,
    columns,
    months: buildMonthLabels(cells, columns),
    stats,
    summary: parts.join(" "),
  };
}
