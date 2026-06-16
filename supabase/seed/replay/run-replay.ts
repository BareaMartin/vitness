import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import {
  recordedMatchSchema,
  ReplayProvider,
  type MatchEvent,
  type RecordedMatch,
} from "../../../packages/shared/src/index.ts";

/**
 * Replays a recorded match into the local Supabase stack at an accelerated
 * speed: events land in match_events in timeline order and the match status
 * transitions scheduled → live → halftime → finished. Dev + demo tool; targets
 * the LOCAL stack only (service-role key from env). See ticket VIT-1.
 *
 * Usage: pnpm replay [-- --speed 60 --fixture arg-mex-2026.json]
 */

const HERE = dirname(fileURLToPath(import.meta.url));

const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

interface StatusForEvent {
  status: "live" | "halftime" | "finished";
}

function statusAfter(event: MatchEvent): StatusForEvent["status"] | null {
  switch (event.type) {
    case "kickoff":
      return "live";
    case "half_time":
      return "halftime";
    case "full_time":
      return "finished";
    default:
      return null;
  }
}

function loadFixture(fixtureArg: string): RecordedMatch {
  const path = resolve(HERE, fixtureArg);
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const parsed = recordedMatchSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(`fixture ${fixtureArg} failed validation:`);
    console.error(parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n"));
    process.exit(1);
  }
  return parsed.data;
}

/** Cross-check that every goal's scorer/assist exists in the scoring lineup. */
function assertPlayersResolve(recorded: RecordedMatch): void {
  const ids = {
    home: new Set(recorded.lineups.home.players.map((p) => p.id)),
    away: new Set(recorded.lineups.away.players.map((p) => p.id)),
  };
  for (const event of recorded.events) {
    if (event.type !== "goal") continue;
    const pool = ids[event.team];
    if (!pool.has(event.scorerId)) {
      console.error(`goal ${event.providerEventId}: scorer ${event.scorerId} not in ${event.team} lineup`);
      process.exit(1);
    }
    if (event.assistId !== undefined && !pool.has(event.assistId)) {
      console.error(`goal ${event.providerEventId}: assist ${event.assistId} not in ${event.team} lineup`);
      process.exit(1);
    }
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      speed: { type: "string", default: "60" },
      fixture: { type: "string", default: "arg-mex-2026.json" },
    },
  });

  const speed = Number(values.speed);
  if (!Number.isFinite(speed) || speed <= 0) {
    console.error(`--speed must be a positive number, got "${values.speed}"`);
    process.exit(1);
  }

  const recorded = loadFixture(values.fixture as string);
  assertPlayersResolve(recorded);

  const url = process.env.SUPABASE_URL ?? LOCAL_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const matchId = recorded.match.id;

  const upsertMatch = await supabase.from("matches").upsert(
    {
      id: matchId,
      provider_match_id: recorded.match.providerMatchId ?? null,
      home_team: recorded.match.homeTeam,
      away_team: recorded.match.awayTeam,
      kickoff_at: recorded.match.kickoffAt,
      status: "scheduled",
    },
    { onConflict: "id" },
  );
  if (upsertMatch.error) {
    console.error(`cannot reach Supabase or upsert match — is the local stack running? (\`supabase start\`)`);
    console.error(`  ${upsertMatch.error.message}`);
    process.exit(1);
  }

  const cleared = await supabase.from("match_events").delete().eq("match_id", matchId);
  if (cleared.error) {
    console.error(`failed clearing prior events: ${cleared.error.message}`);
    process.exit(1);
  }

  console.log(`▶ replaying ${recorded.match.homeTeam} vs ${recorded.match.awayTeam} (${matchId}) at speed ${speed}×`);

  const provider = new ReplayProvider([recorded], { speed });
  let emitted = 0;

  await provider.streamEvents(matchId, async (event) => {
    const insert = await supabase.from("match_events").insert({
      match_id: matchId,
      provider_event_id: event.providerEventId,
      type: event.type,
      team: event.team,
      minute: event.minute,
      payload: event,
    });
    if (insert.error) {
      throw new Error(`insert ${event.providerEventId} failed: ${insert.error.message}`);
    }

    const nextStatus = statusAfter(event);
    if (nextStatus !== null) {
      const bump = await supabase.from("matches").update({ status: nextStatus }).eq("id", matchId);
      if (bump.error) throw new Error(`status bump failed: ${bump.error.message}`);
    }

    emitted += 1;
    console.log(`  ${String(event.minute).padStart(3)}'  ${event.type}${nextStatus ? `  → ${nextStatus}` : ""}`);
  });

  console.log(`✓ replay complete — ${emitted} events written to match_events`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
