import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { composePlayScript } from "../../../packages/shared/src/index.ts";
import { SQUADS_BY_NAME } from "./catalog-source.ts";

/**
 * Seeds "who scored?" trivia for real WC 2026 goals whose scoring team has a
 * curated squad. The correct option is the real scorer (from openfootball); the
 * distractors are same-team squad players. The play_script is the stylized
 * composer's output. Goals by teams without a curated squad are left watch-only.
 * Idempotent: clears prior wc2026-m* jugadas first. See ticket VIT-7 Phase 2.
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
  team1: string;
  team2: string;
  score?: { ft?: [number, number] };
  goals1?: OfGoal[];
  goals2?: OfGoal[];
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? LOCAL_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const data = JSON.parse(readFileSync(join(HERE, "openfootball-2026.json"), "utf8")) as { matches: OfMatch[] };

  await supabase.from("jugadas").delete().like("provider_event_id", "wc2026-m%");

  const rows: Record<string, unknown>[] = [];

  data.matches.forEach((m, i) => {
    if (!m.score?.ft) return;
    const matchId = `wc2026-m${i + 1}`;
    const sides: Array<{ side: "home" | "away"; team: string; goals: OfGoal[] }> = [
      { side: "home", team: m.team1, goals: m.goals1 ?? [] },
      { side: "away", team: m.team2, goals: m.goals2 ?? [] },
    ];

    for (const { side, team, goals } of sides) {
      const squad = SQUADS_BY_NAME[team];
      if (!squad) continue;

      goals.forEach((g, idx) => {
        const providerEventId = `${matchId}-${side}-g${idx}`;
        const correctId = slug(g.name);
        const distractors = shuffle(squad.players.filter((p) => p.name !== g.name))
          .slice(0, 3)
          .map((p) => ({ id: p.id, label: p.name }));
        const options = shuffle([{ id: correctId, label: g.name }, ...distractors]);

        rows.push({
          source: "live",
          match_id: matchId,
          provider_event_id: providerEventId,
          minute: parseInt(String(g.minute), 10) || 0,
          title: `${team} goal`,
          play_script: composePlayScript({ providerEventId, team: side, scorerId: correctId }),
          distractors: [{ slotId: "scorer", role: "scorer", prompt: "Who scored?", options }],
          answer_key: { scorer: correctId },
        });
      });
    }
  });

  if (rows.length > 0) {
    const { error } = await supabase.from("jugadas").insert(rows);
    if (error) {
      console.error(`real-jugada insert failed: ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`✓ seeded ${rows.length} who-scored jugadas for real goals (teams with curated squads)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
