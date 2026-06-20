import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

/**
 * Seeds retro jugadas (compiled from real StatsBomb data) into the jugadas
 * table: play_script + distractors + answer key, source 'retro', no match_id.
 * Reuses the jugada_challenges view + submit-answer grading. Idempotent.
 * See ticket VIT-8.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../../../apps/mobile/src/data/retro-jugadas.json");
const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

interface RetroJugada {
  providerEventId: string;
  title: string;
  playScript: unknown;
  distractors: unknown;
  answerKey: unknown;
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? LOCAL_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const jugadas = JSON.parse(readFileSync(SRC, "utf8")) as RetroJugada[];

  for (const j of jugadas) {
    await supabase.from("jugadas").delete().eq("provider_event_id", j.providerEventId);
    const { error } = await supabase.from("jugadas").insert({
      source: "retro",
      match_id: null,
      provider_event_id: j.providerEventId,
      minute: 0,
      title: j.title,
      play_script: j.playScript,
      distractors: j.distractors,
      answer_key: j.answerKey,
    });
    if (error) {
      console.error(`failed seeding ${j.providerEventId}: ${error.message}`);
      process.exit(1);
    }
    console.log(`✓ seeded retro jugada ${j.providerEventId}`);
  }
  console.log(`done — ${jugadas.length} retro jugada(s)`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
