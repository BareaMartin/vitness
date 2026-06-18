import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

/**
 * Seeds the real WC 2026 tournament — all fixtures and their goal events — from
 * the committed openfootball snapshot (public domain). Match rooms then show the
 * real schedule, scores, and scorers. The synthetic ARG-MEX showcase match
 * (wc2026-grp-arg-mex, used for the live-replay + jugada/trivia/sticker demo) is
 * left untouched. Idempotent: clears prior wc2026-m* rows before inserting.
 * See ticket VIT-5 / data refresh.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

interface OfGoal {
  name: string;
  minute: string | number;
}
interface OfMatch {
  num: number;
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  group?: string;
  ground?: string;
  score?: { ft?: [number, number] };
  goals1?: OfGoal[];
  goals2?: OfGoal[];
}

function kickoffIso(date: string, time?: string): string {
  if (!time) return `${date}T12:00:00Z`;
  const hm = time.match(/(\d{1,2}):(\d{2})/);
  const tz = time.match(/UTC([+-]\d{1,2})/);
  const hhmm = hm ? `${hm[1].padStart(2, "0")}:${hm[2]}` : "12:00";
  const offset = tz ? `${Number(tz[1]) >= 0 ? "+" : "-"}${String(Math.abs(Number(tz[1]))).padStart(2, "0")}:00` : "Z";
  return `${date}T${hhmm}:00${offset}`;
}

function parseMinute(m: string | number): number {
  const base = parseInt(String(m), 10);
  return Number.isFinite(base) ? Math.max(0, Math.min(130, base)) : 0;
}

function goalEvents(match: OfMatch, matchId: string) {
  const make = (goals: OfGoal[] | undefined, team: "home" | "away") =>
    (goals ?? []).map((g, i) => {
      const minute = parseMinute(g.minute);
      return {
        match_id: matchId,
        provider_event_id: `${matchId}-${team}-g${i}`,
        type: "goal",
        team,
        minute,
        payload: {
          type: "goal",
          minute,
          team,
          providerEventId: `${matchId}-${team}-g${i}`,
          scorerId: g.name,
        },
      };
    });
  return [...make(match.goals1, "home"), ...make(match.goals2, "away")];
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? LOCAL_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const data = JSON.parse(readFileSync(join(HERE, "openfootball-2026.json"), "utf8")) as { matches: OfMatch[] };

  await supabase.from("matches").delete().like("id", "wc2026-m%");

  const withId = data.matches.map((m, i) => ({ match: m, id: `wc2026-m${i + 1}` }));

  const matchRows = withId.map(({ match: m, id }) => ({
    id,
    provider_match_id: `of-${m.num ?? id}`,
    home_team: m.team1,
    away_team: m.team2,
    kickoff_at: kickoffIso(m.date, m.time),
    status: m.score?.ft ? "finished" : "scheduled",
  }));

  const { error: mErr } = await supabase.from("matches").upsert(matchRows, { onConflict: "id" });
  if (mErr) {
    console.error(`match upsert failed: ${mErr.message}`);
    process.exit(1);
  }

  const eventRows = withId.flatMap(({ match: m, id }) => goalEvents(m, id));
  if (eventRows.length > 0) {
    const { error: eErr } = await supabase
      .from("match_events")
      .upsert(eventRows, { onConflict: "match_id,provider_event_id" });
    if (eErr) {
      console.error(`event upsert failed: ${eErr.message}`);
      process.exit(1);
    }
  }

  const finished = matchRows.filter((m) => m.status === "finished").length;
  console.log(`✓ seeded ${matchRows.length} real WC 2026 matches (${finished} finished), ${eventRows.length} goal events`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
