# VITNESS

> *¿Viste el partido?* — second-screen World Cup companion. Watch a match, the
> app redraws each key play as a 2D reconstruction, you prove you saw it by
> naming who was in the play, and that earns sticker packs that fill an album
> you didn't buy — you witnessed it.

Built for the Qubika World Cup Challenge (FIFA World Cup 2026).

## Concept

See [`docs/CONCEPT.md`](docs/CONCEPT.md) for the full design: mechanics, economy,
mesas, data pipeline, security model, and build order.

## Stack

| Layer | Tech |
|-------|------|
| Mobile | Expo React Native + expo-router, Skia (pitch sim), Reanimated (packs) |
| Backend | Supabase only — Postgres + RLS, edge functions (Deno), realtime, pg_cron poller |
| Shared | `@vitness/shared` — PlayScript Zod schema + domain types |
| Live data | API-Football (WC 2026) |
| Retro data | StatsBomb Open Data (compiled offline) |
| AI | Claude (personas, live play composition) |

## Layout

```
apps/mobile        Expo RN app
supabase/          migrations + edge functions (the whole backend)
packages/shared    PlayScript schema + domain types
docs/CONCEPT.md    design document
```

## Prerequisites

- Node 22+, pnpm 10
- Docker or OrbStack (for `supabase start` — local backend stack)

## Develop

```bash
pnpm install
pnpm mobile                      # start Expo
pnpm test                        # run unit tests (Vitest)
pnpm exec supabase start         # local Postgres + auth + realtime + edge functions
pnpm exec supabase db reset      # apply migrations to the local db
```

### Replay a recorded match

The replay engine streams a recorded match into the local Supabase stack at an
accelerated speed — so the match room and demos run with zero live-API
dependency. Start the stack first, then:

```bash
pnpm replay                      # default: arg-mex-2026 fixture at 60× (~90s)
pnpm replay -- --speed=600       # faster (~9s)
pnpm replay -- --fixture=arg-mex-2026.json --speed=300
```

`--speed` is match-minutes per real-second (60 = real time). The runner validates
the fixture, clears any prior events for that match, then writes events into
`match_events` in timeline order and advances `matches.status`
(scheduled → live → halftime → finished). Re-running is idempotent.

Recorded-match fixtures live in [`supabase/seed/replay/`](supabase/seed/replay/).
