import type { Match, MatchLineups } from "../match.ts";
import type { MatchEvent, RecordedMatch } from "../match-event.ts";
import type { MatchDataProvider } from "../match-data-provider.ts";
import { replayEvents, type ReplayClockOptions } from "../replay-clock.ts";

/**
 * Replays recorded matches on an accelerated timeline. Same contract as the
 * live provider, so the match room and demo run identically against a recorded
 * match with no live data. Timeline behavior is delegated to replay-clock.
 */
export class ReplayProvider implements MatchDataProvider {
  private readonly byId: Map<string, RecordedMatch>;
  private readonly options: ReplayClockOptions;

  constructor(matches: readonly RecordedMatch[], options: ReplayClockOptions) {
    this.byId = new Map(matches.map((m) => [m.match.id, m]));
    this.options = options;
  }

  getFixtures(): Promise<Match[]> {
    return Promise.resolve([...this.byId.values()].map((m) => m.match));
  }

  getLineups(matchId: string): Promise<MatchLineups> {
    return Promise.resolve(this.require(matchId).lineups);
  }

  streamEvents(
    matchId: string,
    onEvent: (event: MatchEvent) => Promise<void>,
  ): Promise<void> {
    const recorded = this.require(matchId);
    return replayEvents(recorded.events, onEvent, this.options);
  }

  private require(matchId: string): RecordedMatch {
    const recorded = this.byId.get(matchId);
    if (recorded === undefined) {
      throw new Error(`no recorded match with id "${matchId}"`);
    }
    return recorded;
  }
}
