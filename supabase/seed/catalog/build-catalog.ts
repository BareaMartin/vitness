import { createClient } from "@supabase/supabase-js";
import type { StickerCard } from "../../../packages/shared/src/index.ts";
import { SQUADS_BY_NAME, playerRarity, DEMO_MATCH_ID } from "./catalog-source.ts";

/**
 * Builds the player sticker catalog from every curated squad. Player cards are
 * tournament-wide (no match_id, tagged with team_code) so they show both in a
 * team's mega-album page and in any match album for that team. The demo match's
 * MOTM + golazo stay match-scoped. roll_rarity drives drop odds, rarity drives
 * visual prestige (see VIT-12). Idempotent by card kind. See ticket VIT-5/VIT-12.
 */

const LOCAL_URL = "http://127.0.0.1:54321";
const LOCAL_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

interface StickerRow {
  match_id: string | null;
  team_code: string;
  album_slot: number;
  rarity: string;
  roll_rarity: string;
  title: string;
  subtitle: string;
  embedded_jugada_id: string | null;
  meta: StickerCard;
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL ?? LOCAL_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? LOCAL_SERVICE_ROLE_KEY;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Map each retro jugada's provider id → row id, to embed in its golazo card.
  const { data: retroJugadas } = await supabase
    .from("jugadas")
    .select("id, provider_event_id")
    .eq("source", "retro");
  const jugadaIdByEvent = new Map<string, string>(
    ((retroJugadas as { id: string; provider_event_id: string }[]) ?? []).map((j) => [j.provider_event_id, j.id]),
  );

  const rows: StickerRow[] = [];
  let slot = 0;

  const squads = Object.values(SQUADS_BY_NAME);
  const seen = new Set<string>();
  for (const squad of squads) {
    if (seen.has(squad.team.code)) continue;
    seen.add(squad.team.code);
    for (const p of squad.players) {
      const rarity = playerRarity(p.id);
      rows.push({
        match_id: null,
        team_code: squad.team.code,
        album_slot: slot++,
        rarity,
        roll_rarity: rarity,
        title: p.name,
        subtitle: `${p.position} · ${squad.team.name}`,
        embedded_jugada_id: null,
        meta: {
          kind: "player",
          rarity,
          team: squad.team,
          title: p.name,
          subtitle: `${p.position} · ${squad.team.name}`,
          playerName: p.name,
          shirtNumber: p.shirtNumber,
          position: p.position,
        },
      });
    }
  }

  const arg = SQUADS_BY_NAME.Argentina!;
  rows.push({
    match_id: DEMO_MATCH_ID,
    team_code: arg.team.code,
    album_slot: slot++,
    rarity: "rare",
    roll_rarity: "rare",
    title: "Player of the Match",
    subtitle: "Lionel Messi",
    embedded_jugada_id: null,
    meta: {
      kind: "motm",
      rarity: "rare",
      team: arg.team,
      title: "Player of the Match",
      subtitle: "Lionel Messi",
      playerName: "Lionel Messi",
      shirtNumber: 10,
      position: "AM",
    },
  });

  // Golazos: six real WC2022 stunners, each unlocking its StatsBomb reconstruction.
  // Tournament-wide (match_id null) so the Golazos tab shows them across nations.
  const GOLAZOS: { team: string; title: string; player: string; moment: string }[] = [
    { team: "Argentina", title: "Di María · the team goal", player: "Ángel Di María", moment: "retro-wc2022-final-dimaria" },
    { team: "Argentina", title: "Messi · extra-time winner", player: "Lionel Messi", moment: "retro-wc2022-final-messi" },
    { team: "France", title: "Mbappé · the comeback", player: "Kylian Mbappé", moment: "retro-wc2022-final-mbappe" },
    { team: "Brazil", title: "Richarlison · bicycle kick", player: "Richarlison", moment: "retro-wc2022-bra-ser-richarlison" },
    { team: "Argentina", title: "Messi · unlocks Mexico", player: "Lionel Messi", moment: "retro-wc2022-arg-mex-messi" },
    { team: "France", title: "Mbappé · vs Poland", player: "Kylian Mbappé", moment: "retro-wc2022-fra-pol-mbappe" },
  ];
  for (const g of GOLAZOS) {
    const squad = SQUADS_BY_NAME[g.team];
    if (!squad) continue;
    const jid = jugadaIdByEvent.get(g.moment) ?? null;
    rows.push({
      match_id: null,
      team_code: squad.team.code,
      album_slot: slot++,
      rarity: "legendary",
      roll_rarity: "legendary",
      title: g.title,
      subtitle: "Golazo",
      embedded_jugada_id: jid,
      meta: {
        kind: "golazo",
        rarity: "legendary",
        team: squad.team,
        title: g.title,
        subtitle: "Golazo",
        playerName: g.player,
        embeddedJugadaId: jid ?? undefined,
        historicMomentId: g.moment,
      },
    });
  }

  // Idempotent by kind: clear players + golazos + the demo specials, leave badges.
  await supabase.from("stickers").delete().eq("match_id", DEMO_MATCH_ID);
  await supabase.from("stickers").delete().is("match_id", null).eq("meta->>kind", "player");
  await supabase.from("stickers").delete().is("match_id", null).eq("meta->>kind", "golazo");
  const { error } = await supabase.from("stickers").insert(rows);
  if (error) {
    console.error(`catalog insert failed: ${error.message}`);
    process.exit(1);
  }

  const byRarity = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.rarity] = (acc[r.rarity] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`✓ seeded ${rows.length} stickers across ${seen.size} teams:`, JSON.stringify(byRarity));
  console.log(`  golazos: ${GOLAZOS.length} (linked jugadas: ${[...jugadaIdByEvent.keys()].length})`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
