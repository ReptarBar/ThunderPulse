import { getJSON } from "../util/http";
import { windowBounds } from "../util/time";
import type { SourceResult, MonthBucket } from "../types";

const GH = "https://api.github.com";
const ORG = process.env.GITHUB_ORG || "thunderbird";

const WINDOWS = [7, 14, 30, 60, 90, 180, 365];

function lastNCalendarMonths(n: number): { key: string; label: string; sinceISO: string; untilISO: string }[] {
  const out: { key: string; label: string; sinceISO: string; untilISO: string }[] = [];
  const now = new Date();
  let y = now.getUTCFullYear();
  let m = now.getUTCMonth(); // 0-11, current month index
  // Start from the previous full month. If today is mid-month, we still want full months.
  m = m - 1;
  if (m < 0) { m = 11; y -= 1; }
  for (let i = 0; i < n; i++) {
    const year = y;
    const monthIndex = m - i;
    const adjYear = year + Math.floor((monthIndex) / 12);
    const adjMonthIndex = ((monthIndex % 12) + 12) % 12;
    const month = adjMonthIndex + 1; // 1-12
    const since = new Date(Date.UTC(adjYear, adjMonthIndex, 1, 0, 0, 0));
    const until = new Date(Date.UTC(adjYear, adjMonthIndex + 1, 1, 0, 0, 0)); // first of next month
    const key = `${adjYear}-${String(month).padStart(2, '0')}`;
    const label = since.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    out.push({ key, label, sinceISO: since.toISOString(), untilISO: until.toISOString() });
  }
  return out;
}

export async function collectGitHub(token: string) : Promise<SourceResult> {
  const headers: Record<string,string> = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // list public repos
  const repos = await getJSON<any[]>(`${GH}/orgs/${ORG}/repos?per_page=100&type=public`, headers);

  const perWindow = new Map<number, Set<string>>();
  WINDOWS.forEach(d => perWindow.set(d, new Set<string>()));

  const lifetime = new Set<string>();

  // Prepare month buckets (last 12 full months, newest first)
  const monthDefs = lastNCalendarMonths(12);
  const perMonth = monthDefs.map(() => new Set<string>());

  for (const r of repos) {
    // Lifetime contributors (union across all time, GitHub pre-aggregates this endpoint)
    const contribUrl = `${GH}/repos/${ORG}/${r.name}/contributors?per_page=100&anon=true`;
    try {
      const contributors = await getJSON<any[]>(contribUrl, headers);
      for (const c of contributors) {
        if (c?.login) lifetime.add(`gh:${c.login}`);
      }
    } catch (e) {
      console.error("contributors fetch failed", r.name, e);
    }

    // Per window via commits
    for (const days of WINDOWS) {
      const { sinceISO } = windowBounds(days);
      const commitsUrl = `${GH}/repos/${ORG}/${r.name}/commits?since=${encodeURIComponent(sinceISO)}&per_page=100`;
      try {
        const commits = await getJSON<any[]>(commitsUrl, headers);
        for (const k of commits) {
          const login = k?.author?.login;
          if (login) perWindow.get(days)!.add(`gh:${login}`);
        }
      } catch (e) {
        console.error("commit fetch failed", r.name, e);
      }
    }

    // Per month via commits with since+until
    for (let i = 0; i < monthDefs.length; i++) {
      const md = monthDefs[i];
      const commitsUrl = `${GH}/repos/${ORG}/${r.name}/commits?since=${encodeURIComponent(md.sinceISO)}&until=${encodeURIComponent(md.untilISO)}&per_page=100`;
      try {
        const commits = await getJSON<any[]>(commitsUrl, headers);
        for (const k of commits) {
          const login = k?.author?.login;
          if (login) perMonth[i].add(`gh:${login}`);
        }
      } catch (e) {
        console.error("monthly commit fetch failed", r.name, e);
      }
    }
  }

  const windowsOut: Record<string, { total: number }> = {};
  for (const d of WINDOWS) windowsOut[String(d)] = { total: perWindow.get(d)!.size };
  windowsOut["all"] = { total: lifetime.size };

  const monthsOut: MonthBucket[] = monthDefs.map((md, i) => ({
    key: md.key,
    label: md.label,
    total: perMonth[i].size,
  }));

  return { source: "github", windows: windowsOut, months: monthsOut };
}
