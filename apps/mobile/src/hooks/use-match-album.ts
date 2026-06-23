import { useEffect, useState } from "react";
import type { StickerCard } from "@vitness/shared";

import { supabase } from "@/lib/supabase";

export interface AlbumPlayer {
  id: string;
  card: StickerCard;
  owned: boolean;
  count: number;
}

export interface SideAlbum {
  teamCode: string;
  players: AlbumPlayer[];
  ownedCount: number;
  total: number;
}

interface MatchAlbumState {
  home: SideAlbum | null;
  away: SideAlbum | null;
  loading: boolean;
}

interface Row {
  id: string;
  team_code: string;
  album_slot: number;
  meta: StickerCard;
}

/**
 * The combined album for a match: both nations' player squads (by team_code)
 * merged with what the user owns. A team with no curated squad comes back null
 * (the screen shows a "coming soon" note for that side). See deploy polish.
 */
export function useMatchAlbum(homeCode: string | null, awayCode: string | null): MatchAlbumState {
  const [home, setHome] = useState<SideAlbum | null>(null);
  const [away, setAway] = useState<SideAlbum | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const codes = [homeCode, awayCode].filter((c): c is string => !!c);
    if (codes.length === 0) {
      setHome(null);
      setAway(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      const [{ data: cards }, { data: owned }] = await Promise.all([
        supabase
          .from("stickers")
          .select("id, team_code, album_slot, meta")
          .in("team_code", codes)
          .eq("meta->>kind", "player")
          .order("album_slot", { ascending: true }),
        supabase.from("user_stickers").select("sticker_id, count"),
      ]);
      if (!active) return;
      const ownedMap = new Map<string, number>(
        ((owned as { sticker_id: string; count: number }[]) ?? []).map((r) => [r.sticker_id, r.count]),
      );
      const side = (code: string | null): SideAlbum | null => {
        if (!code) return null;
        const players = ((cards as Row[]) ?? [])
          .filter((r) => r.team_code === code)
          .map((r) => ({
            id: r.id,
            card: r.meta,
            owned: ownedMap.has(r.id),
            count: ownedMap.get(r.id) ?? 0,
          }));
        if (players.length === 0) return null;
        return { teamCode: code, players, ownedCount: players.filter((p) => p.owned).length, total: players.length };
      };
      setHome(side(homeCode));
      setAway(side(awayCode));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [homeCode, awayCode]);

  return { home, away, loading };
}
