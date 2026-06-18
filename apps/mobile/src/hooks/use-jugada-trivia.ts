import { useCallback, useEffect, useState } from "react";
import type { JugadaChallenge, TriviaAnswer, TriviaResult } from "@vitness/shared";

import { supabase } from "@/lib/supabase";

interface TriviaState {
  challenge: JugadaChallenge | null;
  loading: boolean;
  error: string | null;
  submit: (answers: TriviaAnswer) => Promise<TriviaResult | null>;
}

/**
 * Loads the answer-key-free challenge for a goal (from the jugada_challenges
 * view) and submits answers to the submit-answer edge function, which grades
 * server-side and returns the reveal + rewards. See ticket VIT-4.
 */
export function useJugadaTrivia(providerEventId: string): TriviaState {
  const [challenge, setChallenge] = useState<JugadaChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setChallenge(null);
    (async () => {
      const { data, error: chErr } = await supabase
        .from("jugada_challenges")
        .select("id, match_id, provider_event_id, minute, title, distractors")
        .eq("provider_event_id", providerEventId)
        .maybeSingle();
      if (!active) return;
      if (chErr) setError(chErr.message);
      else setChallenge((data as JugadaChallenge) ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [providerEventId]);

  const submit = useCallback(
    async (answers: TriviaAnswer): Promise<TriviaResult | null> => {
      if (!challenge) return null;
      const { data, error: subErr } = await supabase.functions.invoke("submit-answer", {
        body: { jugadaId: challenge.id, answers },
      });
      if (subErr) {
        setError(subErr.message);
        return null;
      }
      return data as TriviaResult;
    },
    [challenge],
  );

  return { challenge, loading, error, submit };
}
