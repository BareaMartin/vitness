import type { Match, MatchLineups } from "./match.ts";
import type { MatchEvent } from "./match-event.ts";

/**
 * The single contract every match-data source implements: the live
 * API-Football poller (VIT-2), static JSON fixtures, and the replay engine.
 * Caller code depends only on this interface, so the source can be swapped with
 * no change to consumers. See docs/CONCEPT.md § Data providers.
 */
export interface MatchDataProvider {
  /** All matches this provider knows about (fixtures + results). */
  getFixtures(): Promise<Match[]>;

  /** Both lineups for a match, keyed by side. */
  getLineups(matchId: string): Promise<MatchLineups>;

  /**
   * Emit the match's events to `onEvent`. A one-shot source resolves after the
   * last event; a timeline source (replay/live) awaits each `onEvent` and
   * spaces emissions over time. Resolves when the stream is exhausted.
   */
  streamEvents(
    matchId: string,
    onEvent: (event: MatchEvent) => Promise<void>,
  ): Promise<void>;
}
