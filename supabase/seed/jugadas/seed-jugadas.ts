import { createClient } from "@supabase/supabase-js";
import type { PlayScript, TriviaSlot } from "../../../packages/shared/src/index.ts";

/**
 * Seeds jugada challenges for the ARG-MEX demo goals into the jugadas table:
 * the play-script, the per-slot options (distractors), and the answer key. The
 * answer key stays server-side; the client reads only the jugada_challenges
 * view. Stand-in for the compose-play pipeline. See ticket VIT-4.
 */

const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const MATCH_ID = "wc2026-grp-arg-mex";

function miniScript(attackingSide: "home" | "away"): PlayScript {
  return {
    version: 1,
    goalType: "open_play",
    durationMs: 5000,
    attackingSide,
    actors: [
      { slotId: "origin", team: attackingSide, role: "origin" },
      { slotId: "scorer", team: attackingSide, role: "scorer" },
    ],
    keyframes: [
      { t: 0, ball: { x: 60, y: 40 }, actors: { origin: { x: 60, y: 40 }, scorer: { x: 90, y: 40 } } },
      { t: 1, ball: { x: 118, y: 40 }, actors: { origin: { x: 80, y: 40 }, scorer: { x: 112, y: 40 } } },
    ],
  };
}

function slots(
  origin: { prompt: string; options: TriviaSlot["options"] },
  scorer: { prompt: string; options: TriviaSlot["options"] },
): TriviaSlot[] {
  return [
    { slotId: "origin", role: "origin", prompt: origin.prompt, options: origin.options },
    { slotId: "scorer", role: "scorer", prompt: scorer.prompt, options: scorer.options },
  ];
}

interface Seed {
  providerEventId: string;
  minute: number;
  title: string;
  attackingSide: "home" | "away";
  distractors: TriviaSlot[];
  answerKey: Record<string, string>;
}

const ARG_MIDS = {
  dePaul: { id: "arg-7", label: "Rodrigo De Paul" },
  macAllister: { id: "arg-20", label: "Alexis Mac Allister" },
  paredes: { id: "arg-5", label: "Leandro Paredes" },
};
const ARG_FWD = {
  messi: { id: "arg-10", label: "Lionel Messi" },
  julian: { id: "arg-9", label: "Julián Álvarez" },
  diMaria: { id: "arg-11", label: "Ángel Di María" },
};
const MEX_MIDS = {
  lozano: { id: "mex-22", label: "Hirving Lozano" },
  herrera: { id: "mex-16", label: "Héctor Herrera" },
  vega: { id: "mex-11", label: "Alexis Vega" },
};
const MEX_FWD = {
  jimenez: { id: "mex-9", label: "Raúl Jiménez" },
  lozano: { id: "mex-22", label: "Hirving Lozano" },
  vega: { id: "mex-11", label: "Alexis Vega" },
};

const seeds: Seed[] = [
  {
    providerEventId: "arg-mex-e03",
    minute: 23,
    title: "Argentina open the scoring",
    attackingSide: "home",
    distractors: slots(
      { prompt: "Who started the move?", options: [ARG_MIDS.dePaul, ARG_MIDS.macAllister, ARG_MIDS.paredes] },
      { prompt: "Who scored?", options: [ARG_FWD.messi, ARG_FWD.julian, ARG_FWD.diMaria] },
    ),
    answerKey: { origin: ARG_MIDS.dePaul.id, scorer: ARG_FWD.messi.id },
  },
  {
    providerEventId: "arg-mex-e06",
    minute: 41,
    title: "Mexico level it",
    attackingSide: "away",
    distractors: slots(
      { prompt: "Who started the move?", options: [MEX_MIDS.lozano, MEX_MIDS.herrera, MEX_MIDS.vega] },
      { prompt: "Who scored?", options: [MEX_FWD.jimenez, MEX_FWD.lozano, MEX_FWD.vega] },
    ),
    answerKey: { origin: MEX_MIDS.lozano.id, scorer: MEX_FWD.jimenez.id },
  },
  {
    providerEventId: "arg-mex-e10",
    minute: 76,
    title: "Messi wins it late",
    attackingSide: "home",
    distractors: slots(
      { prompt: "Who started the move?", options: [ARG_MIDS.dePaul, ARG_MIDS.macAllister, ARG_MIDS.paredes] },
      { prompt: "Who scored?", options: [ARG_FWD.messi, ARG_FWD.julian, ARG_FWD.diMaria] },
    ),
    answerKey: { origin: ARG_MIDS.dePaul.id, scorer: ARG_FWD.messi.id },
  },
];

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? LOCAL_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  for (const seed of seeds) {
    await supabase.from("jugadas").delete().eq("provider_event_id", seed.providerEventId);
    const { error } = await supabase.from("jugadas").insert({
      source: "live",
      match_id: MATCH_ID,
      provider_event_id: seed.providerEventId,
      minute: seed.minute,
      title: seed.title,
      play_script: miniScript(seed.attackingSide),
      distractors: seed.distractors,
      answer_key: seed.answerKey,
    });
    if (error) {
      console.error(`failed seeding ${seed.providerEventId}: ${error.message}`);
      process.exit(1);
    }
    console.log(`✓ seeded jugada ${seed.providerEventId} (${seed.title})`);
  }
  console.log(`done — ${seeds.length} jugada challenges`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
