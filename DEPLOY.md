# Deploying VITNESS

VITNESS is two deployables: a **hosted Supabase project** (Postgres + RLS + edge
functions + realtime) and a **static web build** (Expo web export) served from
any static host. The web bundle talks to Supabase over the public anon key, so
the only deploy-time wiring is pointing the web build at the hosted project.

> Steps that create accounts, link projects, or push to a host need your own
> credentials — run those yourself. Everything here is copy-pasteable once you're
> logged in.

---

## 0. Prerequisites

- A [Supabase](https://supabase.com) account and a new (empty) project
- Supabase CLI — already a dev dependency: `pnpm exec supabase --version`
- A static host for the web build (Vercel, Netlify, Cloudflare Pages, or GitHub Pages)
- Node 22+, pnpm 10

---

## 1. Backend — hosted Supabase

### 1.1 Link the CLI to your project

```bash
pnpm exec supabase login                       # opens browser for an access token
pnpm exec supabase link --project-ref <your-project-ref>
```

`<your-project-ref>` is the subdomain of your project URL
(`https://<ref>.supabase.co`, found under Settings → General).

### 1.2 Push the schema

All schema lives in `supabase/migrations/` (9 migrations: initial schema,
`open_pack` RPC + no-dupes patch, match events, realtime publication, trivia,
collection read policies, role grants).

```bash
pnpm exec supabase db push                     # applies every migration in order
```

### 1.3 Deploy the edge functions

```bash
pnpm exec supabase functions deploy submit-answer
pnpm exec supabase functions deploy compose-play
pnpm exec supabase functions deploy personas
pnpm exec supabase functions deploy poller
```

`submit-answer` is the only one required for the core demo (server-graded
trivia). It reads `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` — all three are **injected automatically** by the
Supabase runtime, so no manual secrets are needed for it. If you wire up the
AI-backed functions later, set their keys with
`pnpm exec supabase secrets set NAME=value`.

### 1.4 Enable anonymous sign-in + set the site URL

The app signs in anonymously on launch so RLS-gated reads work. In the
dashboard: **Authentication → Providers → Anonymous → enable**, then
**Authentication → URL Configuration → Site URL** = your deployed web URL
(e.g. `https://vitness.vercel.app`). This mirrors `enable_anonymous_sign_ins`
and `site_url` in `supabase/config.toml`.

### 1.5 Seed the data

The seed scripts read `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from the
environment (falling back to the local stack when unset). Point them at the
hosted project for this one-off load — use the **service-role** key (Settings →
API), never ship it to the client:

```bash
export SUPABASE_URL="https://<ref>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

node supabase/seed/catalog/build-catalog.ts        # ARG-MEX squads → stickers
node supabase/seed/catalog/build-mega-album.ts     # 48 WC2026 team badges
node supabase/seed/catalog/populate-tournament.ts  # real fixtures + goal events
node supabase/seed/jugadas/seed-jugadas.ts         # ARG-MEX demo trivia + key
node supabase/seed/catalog/seed-real-jugadas.ts    # real-goal "who scored?" trivia
node supabase/seed/retro/seed-retro.ts             # StatsBomb retro golazos

unset SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY        # don't leak into the web build
```

All seeds are idempotent — safe to re-run. The live ARG-MEX replay
(`pnpm replay`) is a local demo tool and is **not** needed in production.

---

## 2. Web — static export

### 2.1 Point the build at the hosted backend

Create `apps/mobile/.env` from the template and fill in the **anon** key (the
public one — Settings → API):

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

```ini
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

These are read in `apps/mobile/app.config.ts`. With them unset the build falls
back to the local stack, so production deploys **must** set them.

### 2.2 Export

```bash
pnpm export:web        # → apps/mobile/dist/ (static SPA, web.output = "single")
```

### 2.3 Host `dist/`

The app is a single-page app, so the host must rewrite all unknown paths to
`index.html`.

**Vercel** — set Output Directory to `apps/mobile/dist`, framework "Other", and
add a rewrite:

```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Netlify** — publish directory `apps/mobile/dist`, with:

```
# apps/mobile/dist/_redirects
/*  /index.html  200
```

Set the two `EXPO_PUBLIC_SUPABASE_*` variables in the host's build-environment
settings so they're inlined when the host runs `pnpm export:web`.

---

## 3. Environment variable reference

| Variable | Where | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | web build | Hosted project URL. Inlined into the client bundle. |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | web build | Public anon key. Safe to ship. |
| `EXPO_PUBLIC_MOCK_PACK_COUNT` | web build (optional) | Demo packs granted to a fresh session (default 20). |
| `SUPABASE_URL` | seed scripts | Hosted project URL for the one-off data load. |
| `SUPABASE_SERVICE_ROLE_KEY` | seed scripts | **Secret.** Server-side only — never in the web build. |

`submit-answer`'s `SUPABASE_URL` / `SUPABASE_ANON_KEY` /
`SUPABASE_SERVICE_ROLE_KEY` are provided by the Supabase functions runtime — you
don't set them.

---

## 4. Smoke test

1. Open the deployed URL — match list loads (anonymous session established).
2. **Mundial** → tap a nation → squad cards render.
3. **Álbum** → "Open pack" → tear → three distinct cards land.
4. Tap a goal → trivia → answer → server grades and awards coins/packs.
