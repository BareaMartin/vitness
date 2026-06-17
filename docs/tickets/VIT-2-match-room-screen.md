# VIT-2: Match room screen — live match, driven by realtime

> Build-order #1 (remaining half) from [`docs/CONCEPT.md`](../CONCEPT.md). VIT-1
> built the data layer + replay engine; this makes it **visible**: the first real
> screen, a match room that updates live as events land in `match_events`.

## User Story

**As a** fan with the app open during a match
**I want** to see the match come alive on screen — score, clock, status, and a
live feed of what just happened
**So that** the app is a real second-screen companion, and (for the tournament)
we have a demoable centerpiece driven by the replay engine.

## Scope

In:
- Supabase client in the mobile app + **anonymous auth** on launch (RLS reads need an authenticated session).
- A `matches` list on the home tab; tapping one opens the match room (component-state navigation — no router restructuring this ticket).
- Match room: header (teams, derived score, clock from latest minute, status pill), a **live event feed** that appends as events arrive, and a simple momentum bar (share of recent attacking events per side).
- Realtime: subscribe to `match_events` INSERTs for the open match; the screen updates with no refresh as `pnpm replay` runs.

Out (own later tickets):
- The 2D Skia pitch reconstruction (jugada sim).
- The full 4-tab IA (Hoy/Álbum/Retro/La Mesa), proper stack routes, deep links.
- Trivia, packs, predictions, personas.
- Live API-Football poller.

## Acceptance Criteria

### Scenario 1: Match room reflects replay live (happy path)

```gherkin
Given the local stack is running and the app has signed in anonymously
And the match room is open for the ARG-MEX demo match
When `pnpm replay` streams the recorded match
Then the event feed appends each event as it arrives, newest first
And the score updates when goal events arrive (ARG 2 – MEX 1 by full time)
And the status pill transitions live → halftime → finished
And no manual refresh is needed
```

### Scenario 2: Score and clock are derived, not stored

```gherkin
Given a set of match_events for a match
When the match room renders
Then the score equals the count of goal events per side
And the clock shows the minute of the latest event
```

### Scenario 3: Empty / pre-kickoff match

```gherkin
Given a match with status scheduled and no events yet
When the match room is opened
Then it shows the teams and a "kickoff soon" empty state, not an error
```

### Scenario 4: Auth + RLS

```gherkin
Given the app uses the public anon key and anonymous sign-in
When it queries matches and match_events
Then reads succeed under the authenticated RLS policies
And no service-role key is present anywhere in the app bundle
```

## Technical Context

### Current state
- `matches` + `match_events` exist with `authenticated`-read RLS (VIT-1).
- Replay runner writes events to the local stack.
- Mobile app: Expo 56 / RN 0.85, expo-router with `NativeTabs`, `ThemedText/ThemedView`, theme constants. `@vitness/shared` linked.

### Proposed changes

**Backend (1 migration):**
- Add `match_events` (and `matches`) to the `supabase_realtime` publication so the client receives INSERTs.

**Mobile:**
- `src/lib/supabase.ts` — `createClient` with the local URL + anon key, `react-native-url-polyfill/auto`, AsyncStorage as auth storage, `detectSessionInUrl: false`. URL/key from `app.json` `extra` (env-overridable); anon key is public by design.
- `src/lib/auth.ts` (or a small provider) — sign in anonymously on launch; expose session readiness.
- `src/hooks/use-match-room.ts` — fetch match + existing events, subscribe to realtime INSERTs on `match_events` filtered by `match_id`; expose `{ match, events, score, minute, status }`. Score/clock derived from events.
- `src/components/match/match-room.tsx` — header + momentum bar + event feed (uses themed components + `@vitness/shared` types).
- `src/components/match/match-list.tsx` — lists `matches`.
- `src/app/index.tsx` — holds `selectedMatchId`; renders list or room with a back affordance.

Deps via `npx expo install`: `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `react-native-url-polyfill` (SDK-56-compatible versions).

### Architecture decisions

| Decision | Rationale |
|----------|-----------|
| Component-state navigation (not new router routes) | Expo 56 nav is version-sensitive; this ticket avoids restructuring `NativeTabs`. Proper routes come with the 4-tab IA ticket. |
| Anonymous auth | Cheapest way to get an `authenticated` session so RLS reads work; real accounts/onboarding are a later ticket. |
| Score/clock derived from events, never stored | Single source of truth is the event stream; no denormalized state to desync. |
| Realtime via `postgres_changes` on `match_events` | Matches the durable-rows design from VIT-1; the replay runner already writes the rows the screen subscribes to. |

## Out Of Scope / Edge Cases

- Reconnect after backgrounding: on resubscribe, re-fetch current events to fill any gap (no event replay-from-cursor this ticket).
- Multiple simultaneous matches: list shows all; only the open room subscribes.
- Anonymous-auth disabled on the stack: surface a clear error (anonymous sign-in must be enabled in `config.toml`).

## Definition Of Done

- `pnpm --filter mobile typecheck` passes; kebab-case + themed components; shared types used.
- Migration applies via `supabase db reset`; `match_events` is in the realtime publication.
- Manually verified: open the room, run `pnpm replay`, watch the feed/score/status update live (web target is fine for the demo).
- README note: anonymous auth must be enabled locally; how to run the app + replay together.

## References
- [`docs/CONCEPT.md`](../CONCEPT.md) § Match rhythm, § Four pillars (The Pitch).
- Expo 56 docs (per `apps/mobile/AGENTS.md`): https://docs.expo.dev/versions/v56.0.0/
- VIT-1 schemas: `@vitness/shared` (`Match`, `MatchEvent`).

**BDD Scenarios**: 4
