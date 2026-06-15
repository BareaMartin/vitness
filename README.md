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
pnpm mobile           # start Expo
supabase start        # local Postgres + auth + realtime + edge functions
supabase db reset     # apply migrations to the local db
```
