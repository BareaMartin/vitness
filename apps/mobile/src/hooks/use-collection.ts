import { useCallback, useEffect, useState } from "react";
import type { StickerCard } from "@vitness/shared";
import Constants from "expo-constants";

import { supabase } from "@/lib/supabase";

const extra = Constants.expoConfig?.extra ?? {};
const configuredMockPackCount = Number(extra.mockPackCount ?? 0);
const MOCK_PACK_COUNT = Number.isFinite(configuredMockPackCount)
  ? Math.max(0, Math.trunc(configuredMockPackCount))
  : 0;

function buildMockPackIds(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `mock-pack-${i + 1}`);
}

/** The demo match whose album the collection screen shows (the showcase match). */
export const DEMO_MATCH_ID = "wc2026-grp-arg-mex";
/** The showcase match's two teams — its album is their players + the match specials. */
const DEMO_TEAM_CODES = ["ARG", "MEX"];

export interface CatalogSticker {
  id: string;
  rarity: string;
  albumSlot: number;
  card: StickerCard;
  owned: boolean;
  count: number;
}

interface CollectionState {
  stickers: CatalogSticker[];
  ownedCount: number;
  total: number;
  unopenedPackIds: string[];
  loading: boolean;
  refresh: () => void;
}

interface StickerRow {
  id: string;
  rarity: string;
  album_slot: number;
  meta: StickerCard;
}

/**
 * The collection state for the album: the match's full sticker catalog merged
 * with what the user owns, plus the user's unopened packs. Owned/missing and
 * completion are derived. See ticket VIT-6.
 */
export function useCollection(matchId: string = DEMO_MATCH_ID): CollectionState {
  const [stickers, setStickers] = useState<CatalogSticker[]>([]);
  const [unopenedPackIds, setUnopenedPackIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    void (async () => {
      const [{ data: catalog }, { data: owned }, { data: packs }] = await Promise.all([
        supabase
          .from("stickers")
          .select("id, rarity, album_slot, meta")
          // The match album = the two teams' (tournament-wide) players + this
          // match's own specials (MOTM/golazo); badges live in the mega-album.
          .or(`match_id.eq.${matchId},team_code.in.(${DEMO_TEAM_CODES.join(",")})`)
          .neq("meta->>kind", "badge")
          .order("album_slot", { ascending: true }),
        supabase.from("user_stickers").select("sticker_id, count"),
        MOCK_PACK_COUNT > 0
          ? Promise.resolve({ data: buildMockPackIds(MOCK_PACK_COUNT).map((id) => ({ id })) })
          : supabase.from("packs").select("id").eq("state", "unopened"),
      ]);

      const ownedMap = new Map<string, number>(
        ((owned as { sticker_id: string; count: number }[]) ?? []).map((r) => [r.sticker_id, r.count]),
      );

      setStickers(
        ((catalog as StickerRow[]) ?? []).map((s) => ({
          id: s.id,
          rarity: s.rarity,
          albumSlot: s.album_slot,
          card: s.meta,
          owned: ownedMap.has(s.id),
          count: ownedMap.get(s.id) ?? 0,
        })),
      );
      setUnopenedPackIds(((packs as { id: string }[]) ?? []).map((p) => p.id));
      setLoading(false);
    })();
  }, [matchId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ownedCount = stickers.filter((s) => s.owned).length;

  return {
    stickers,
    ownedCount,
    total: stickers.length,
    unopenedPackIds,
    loading,
    refresh,
  };
}
