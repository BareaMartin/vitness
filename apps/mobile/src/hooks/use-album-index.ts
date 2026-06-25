import { useCallback, useEffect, useRef, useState } from "react";
import type { StickerCard } from "@vitness/shared";
import Constants from "expo-constants";

import { supabase } from "@/lib/supabase";

const extra = Constants.expoConfig?.extra ?? {};
const configuredDemoPackCount = Number(extra.mockPackCount ?? 0);
const DEMO_PACK_COUNT = Number.isFinite(configuredDemoPackCount)
  ? Math.max(0, Math.trunc(configuredDemoPackCount))
  : 0;

export interface AlbumSummary {
  /** Stable key + selector for the detail view. */
  key: string;
  kind: "team";
  teamCode: string;
  title: string;
  flag: string;
  owned: number;
  total: number;
}

interface AlbumIndexState {
  albums: AlbumSummary[];
  unopenedPackIds: string[];
  /** Team codes that gained a sticker since their album was last viewed. */
  newTeams: string[];
  /** Clear a team's "new" badge — call when its album is opened. */
  markSeen: (teamCode: string) => void;
  loading: boolean;
  refresh: () => void;
}

interface Row {
  id: string;
  team_code: string | null;
  match_id: string | null;
  meta: StickerCard;
}

/**
 * The album index: one summary per collectible album — the showcase match plus
 * every national team that has a squad — each with owned/total completion, and
 * the user's unopened-pack queue. Badges/golazos are excluded (golazos live on
 * the Golazos tab). See deploy polish.
 */
export function useAlbumIndex(): AlbumIndexState {
  const [albums, setAlbums] = useState<AlbumSummary[]>([]);
  const [unopenedPackIds, setUnopenedPackIds] = useState<string[]>([]);
  const [newTeams, setNewTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // Owned-per-team from the previous load; a team whose count rises has new
  // stickers to show. null until the first load so the baseline isn't flagged.
  const prevOwned = useRef<Map<string, number> | null>(null);

  const markSeen = useCallback((teamCode: string) => {
    setNewTeams((prev) => prev.filter((t) => t !== teamCode));
  }, []);

  const refresh = useCallback(() => {
    void (async () => {
      // Top up the one-time demo allotment (idempotent server-side), so a fresh
      // player has real, openable packs without earning trivia first.
      if (DEMO_PACK_COUNT > 0) {
        await supabase.rpc("grant_demo_packs", { p_count: DEMO_PACK_COUNT });
      }
      const [{ data: cards }, { data: owned }, { data: packs }] = await Promise.all([
        supabase
          .from("stickers")
          .select("id, team_code, match_id, meta")
          .neq("meta->>kind", "badge")
          .neq("meta->>kind", "golazo")
          .order("album_slot", { ascending: true }),
        supabase.from("user_stickers").select("sticker_id"),
        supabase.from("packs").select("id").eq("state", "unopened"),
      ]);

      const ownedSet = new Set(
        ((owned as { sticker_id: string }[]) ?? []).map((r) => r.sticker_id),
      );
      const rows = (cards as Row[]) ?? [];

      // One album per national team with player cards. Matches don't get their
      // own album — tapping a match opens its two countries' combined album.
      const byTeam = new Map<string, Row[]>();
      for (const r of rows) {
        if (r.meta.kind !== "player" || !r.team_code) continue;
        if (!byTeam.has(r.team_code)) byTeam.set(r.team_code, []);
        byTeam.get(r.team_code)!.push(r);
      }
      const teamAlbums: AlbumSummary[] = [...byTeam.entries()]
        .map(([code, teamRows]) => ({
          key: `team:${code}`,
          kind: "team" as const,
          teamCode: code,
          title: teamRows[0]!.meta.team.name,
          flag: teamRows[0]!.meta.team.flagEmoji,
          owned: teamRows.filter((r) => ownedSet.has(r.id)).length,
          total: teamRows.length,
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

      // Flag teams whose owned count rose since the last load (a freshly opened
      // pack), so the index can badge them. Skip the first load (baseline).
      const ownedByTeam = new Map(teamAlbums.map((a) => [a.teamCode, a.owned]));
      if (prevOwned.current) {
        const gained = teamAlbums
          .filter((a) => a.owned > (prevOwned.current!.get(a.teamCode) ?? 0))
          .map((a) => a.teamCode);
        if (gained.length) setNewTeams((prev) => Array.from(new Set([...prev, ...gained])));
      }
      prevOwned.current = ownedByTeam;

      setAlbums(teamAlbums);
      setUnopenedPackIds(((packs as { id: string }[]) ?? []).map((p) => p.id));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { albums, unopenedPackIds, newTeams, markSeen, loading, refresh };
}
