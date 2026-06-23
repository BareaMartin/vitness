import { useCallback, useEffect, useState } from "react";
import type { StickerCard } from "@vitness/shared";

import { supabase } from "@/lib/supabase";

export interface GolazoSticker {
  id: string;
  card: StickerCard;
  owned: boolean;
  solved: boolean;
}

interface GolazosState {
  golazos: GolazoSticker[];
  loading: boolean;
  refresh: () => void;
}

interface Row {
  id: string;
  meta: StickerCard;
}

/**
 * The golazo cards across every nation (kind = golazo, tournament-wide) merged
 * with what the user owns. Each golazo unlocks a real StatsBomb historic moment.
 * Separate from useCollection (which is scoped to the demo match's two teams),
 * so golazos from any country show in the Golazos tab. See VIT-9.
 */
export function useGolazos(): GolazosState {
  const [golazos, setGolazos] = useState<GolazoSticker[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    void (async () => {
      const [{ data: cards }, { data: owned }, { data: attempts }] = await Promise.all([
        supabase.from("stickers").select("id, album_slot, meta").eq("meta->>kind", "golazo").order("album_slot"),
        supabase.from("user_stickers").select("sticker_id"),
        supabase.from("trivia_attempts").select("jugadas!inner(provider_event_id)"),
      ]);
      const ownedSet = new Set(((owned as { sticker_id: string }[]) ?? []).map((r) => r.sticker_id));
      const solvedSet = new Set(
        ((attempts ?? []) as unknown as { jugadas: { provider_event_id: string } }[]).map(
          (a) => a.jugadas.provider_event_id,
        ),
      );
      setGolazos(
        ((cards as Row[]) ?? []).map((c) => ({
          id: c.id,
          card: c.meta,
          owned: ownedSet.has(c.id),
          solved: !!(c.meta as { historicMomentId?: string }).historicMomentId &&
            solvedSet.has((c.meta as { historicMomentId?: string }).historicMomentId!),
        })),
      );
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { golazos, loading, refresh };
}
