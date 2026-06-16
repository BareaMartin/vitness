import type { Match, MatchLineups } from "../match.ts";
import type { MatchEvent, RecordedMatch } from "../match-event.ts";
import type { MatchDataProvider } from "../match-data-provider.ts";
import { orderEvents } from "../replay-clock.ts";

/**
 * A one-shot provider backed by in-memory recorded matches. Emits every event
 * immediately in minute order — useful for tests and for rendering a finished
 * match with no timeline. Implements the same contract as the live provider.
 */
export class StaticJsonProvider implements MatchDataProvider {
  private readonly byId: Map<string, RecordedMatch>;

  constructor(matches: readonly RecordedMatch[]) {
    this.byId = new Map(matches.map((m) => [m.match.id, m]));
  }

  getFixtures(): Promise<Match[]> {
    return Promise.resolve([...this.byId.values()].map((m) => m.match));
  }

  getLineups(matchId: string): Promise<MatchLineups> {
    const recorded = this.require(matchId);
    return Promise.resolve(recorded.lineups);
  }

  async streamEvents(
    matchId: string,
    onEvent: (event: MatchEvent) => Promise<void>,
  ): Promise<void> {
    const recorded = this.require(matchId);
    for (const event of orderEvents(recorded.events)) {
      await onEvent(event);
    }
  }

  private require(matchId: string): RecordedMatch {
    const recorded = this.byId.get(matchId);
    if (recorded === undefined) {
      throw new Error(`no recorded match with id "${matchId}"`);
    }
    return recorded;
  }
}
