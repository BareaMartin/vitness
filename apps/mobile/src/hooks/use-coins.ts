import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

/**
 * Reads the signed-in user's coin balance from their own profile row (gated by
 * the "read own profile" RLS policy). Returns a refresh fn to re-read after a
 * reward lands. See ticket VIT-4.
 */
export function useCoins(): { coins: number; refresh: () => void } {
  const [coins, setCoins] = useState(0);

  const refresh = useCallback(() => {
    void (async () => {
      const { data } = await supabase.from("profiles").select("coins").maybeSingle();
      if (data) setCoins(data.coins as number);
    })();
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { coins, refresh };
}
