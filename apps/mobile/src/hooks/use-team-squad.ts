import { useEffect, useState } from "react";
import type { StickerCard } from "@vitness/shared";

import { supabase } from "@/lib/supabase";

export interface SquadSticker {
  id: string;
  card: StickerCard;
  owned: boolean;
  count: number;
}

interface TeamSquadState {
  players: SquadSticker[];
  ownedCount: number;
  total: number;
  loading: boolean;
}

interface Row {
  id: string;
  album_slot: number;
  meta: StickerCard;
}

/**
 * A nation's player stickers (tournament-wide, by team_code) merged with what
 * the user owns — drives the mega-album's per-team page. Teams without a curated
 * squad return an empty list (the page shows "squad coming soon"). See VIT-12.
 */
export function useTeamSquad(teamCode: string | null): TeamSquadState {
  const [players, setPlayers] = useState<SquadSticker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamCode) {
      setPlayers([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      const [{ data: cards }, { data: owned }] = await Promise.all([
        supabase
          .from("stickers")
          .select("id, album_slot, meta")
          .eq("team_code", teamCode)
          .eq("meta->>kind", "player")
          .order("album_slot", { ascending: true }),
        supabase.from("user_stickers").select("sticker_id, count"),
      ]);
      if (!active) return;
      const ownedMap = new Map<string, number>(
        ((owned as { sticker_id: string; count: number }[]) ?? []).map((r) => [r.sticker_id, r.count]),
      );
      setPlayers(
        ((cards as Row[]) ?? []).map((c) => ({
          id: c.id,
          card: c.meta,
          owned: ownedMap.has(c.id),
          count: ownedMap.get(c.id) ?? 0,
        })),
      );
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [teamCode]);

  return {
    players,
    ownedCount: players.filter((p) => p.owned).length,
    total: players.length,
    loading,
  };
}
