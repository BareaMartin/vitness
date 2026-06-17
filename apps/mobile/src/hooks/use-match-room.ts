import { useEffect, useMemo, useState } from "react";
import type { Match, MatchEvent, TeamSide } from "@vitness/shared";

import { supabase } from "@/lib/supabase";

interface MatchRoomState {
  match: Match | null;
  events: MatchEvent[];
  score: Record<TeamSide, number>;
  minute: number;
  loading: boolean;
  error: string | null;
}

interface MatchRow {
  id: string;
  provider_match_id: string | null;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  status: Match["status"];
}

interface MatchEventRow {
  match_id: string;
  payload: MatchEvent;
}

function toMatch(row: MatchRow): Match {
  return {
    id: row.id,
    providerMatchId: row.provider_match_id ?? undefined,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    kickoffAt: row.kickoff_at,
    status: row.status,
  };
}

function deriveScore(events: readonly MatchEvent[]): Record<TeamSide, number> {
  const score: Record<TeamSide, number> = { home: 0, away: 0 };
  for (const event of events) {
    if (event.type === "goal") score[event.team] += 1;
  }
  return score;
}

/**
 * Loads a match plus its events and keeps them current by subscribing to
 * match_events INSERTs over Realtime. Score and clock are derived from the
 * event stream (never stored). The match row is re-read on status-changing
 * events so the status pill stays accurate. See ticket VIT-2.
 */
export function useMatchRoom(matchId: string): MatchRoomState {
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setEvents([]);

    async function loadMatch(): Promise<void> {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .maybeSingle();
      if (active && data) setMatch(toMatch(data as MatchRow));
    }

    async function loadEvents(): Promise<void> {
      const { data, error: eventsError } = await supabase
        .from("match_events")
        .select("match_id, payload")
        .eq("match_id", matchId)
        .order("minute", { ascending: true });
      if (!active) return;
      if (eventsError) {
        setError(eventsError.message);
      } else if (data) {
        setEvents((data as MatchEventRow[]).map((row) => row.payload));
      }
      setLoading(false);
    }

    void loadMatch();
    void loadEvents();

    const channel = supabase
      .channel(`match-room:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_events", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const row = payload.new as MatchEventRow;
          setEvents((prev) => [...prev, row.payload]);
          if (["kickoff", "half_time", "full_time"].includes(row.payload.type)) {
            void loadMatch();
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [matchId]);

  const score = useMemo(() => deriveScore(events), [events]);
  const minute = useMemo(
    () => events.reduce((max, e) => Math.max(max, e.minute), 0),
    [events],
  );

  return { match, events, score, minute, loading, error };
}
