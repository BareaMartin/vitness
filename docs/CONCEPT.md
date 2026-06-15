# VITNESS — concept document

> **Name locked: VITNESS** — Viste × Witness, one word, both languages, born from *"¿Viste el partido?"*. The app asks *¿Viste?* ("did you see that?"); every earned sticker is stamped **VITNESSED** with its provenance line. Taglines: EN *"Did you see that?"* · ES *"¿Viste el partido?"*. Earlier candidates kept for the record: ¿Viste?, Lo Vi, Witness '26, Figus '26, La Mesa, Álbum '26.

**One-liner:** A second-screen World Cup companion where you watch plays get redrawn as 2D reconstructions, prove you were paying attention by naming who was in the play, and turn that knowledge into sticker packs that fill your album — all narrated by a crew of AI pundits.

**The product in one sentence:** you watch the match → the app turns what you just watched into trivia → trivia proves attention → attention earns figuritas → figuritas fill albums that become the record of *your* World Cup.

## Four pillars

1. **The Pitch (live layer):** an always-on 2D pitch showing ambient match state — attack momentum, possession zone, accumulating shot pins. When a key play happens it transforms into the animated jugada reconstruction. Ambient between plays, cinematic at the moments that matter.
2. **The Game (engagement layer):** jugada trivia (live + retro), micro-predictions, pundit picks. Every game funnels into the same reward economy.
3. **The Collection (retention layer):** packs → stickers → match albums → mega-album → trading. Stickers carry **provenance**: the back of each card is stamped VITNESSED with how it was earned ("VITNESSED · live · 76' ARG–MEX · trivia perfect · June 12, 2026"). The album is not bought — it is witnessed. Trading means trading moments you were there for.
4. **The Cast (voice layer):** the La Mesa personas glue it together — picks, reactions, roasts, recaps.

**Tournament context:** Built for the Qubika World Cup Challenge during the live FIFA World Cup 2026 (June 11 – July 19, 2026, USA/Mexico/Canada, 48 teams, 104 matches). The app runs against real, live tournament data.

**Track:** Fan Experience (with Media & Storytelling and Wildcard elements).

---

## The cast: La Mesa

Three AI pundit personas appear across the whole app — they are the voice of the product:

| Persona | Personality | Prediction style |
|---------|-------------|------------------|
| El Relator | Passionate, poetic, all heart | Narrative & gut feel |
| La Analista | Cold, precise, stats-first | xG and form data |
| El Agitador | Chaos merchant, hot takes | Contrarian, high variance |

They post pre-match predictions, react to live events with one-liners, roast your trivia misses, and (stretch) call goals in TTS audio.

---

## Core loop

```
watch match → play reconstructed in 2D → guess who was in the play
→ earn packs/coins → open packs → fill match album → feed mega-album
→ trade duplicates with friends → repeat every match until the final
```

---

## Match rhythm — what shows when

The match room is a state machine that programs content like a broadcast rundown. Dead time is deliberately filled; live action is never interrupted.

| Phase | State trigger | Content surfaced |
|-------|--------------|------------------|
| Pre-match (T-3h) | Fixture upcoming | Pundit picks + user prediction; lineup trivia once lineups drop (~T-1h); daily retro set reminder |
| Live — action | Event feed active | Ambient pitch (momentum, zone, shot pins); key play → jugada reconstruction + trivia; micro-prediction windows |
| Live — lull | No notable event for ~10 min | Quick quizzes on the match so far ("corner count?", "who has more shots?"); single retro jugada offer |
| Halftime | HT event | **The halftime show:** open queued packs earned in H1; retro jugada themed to the two teams' history; pundit halftime takes; H2 micro-prediction |
| Full time | FT event | MOTM vote; match album fill; persona recap + roast; recap share card; trading window highlight |
| No match today | Schedule gap | Retro set, album browsing, trading, tomorrow's pundit picks |

**Queued packs:** packs earned during live play accumulate as unopened (badge on the album tab). Opening is the dead-time ritual — halftime and full-time — so the pack animation never competes with the actual match. Users can open immediately if they insist, but the default nudge is "save it for the show."

## Usage modes

- **Watching with phone in hand:** full second-screen experience — every layer active.
- **Busy during the match:** push notification on each goal opens a grace window (~10 min) to play that jugada trivia late. Harder without having watched — that's fair.
- **No match / between matchdays:** retro jugadas, trading, album completion, next-day pundit picks. The app has a reason to open every day of the tournament.

---

## Navigation — four tabs

| Tab | Purpose |
|-----|---------|
| **Hoy** | Context-aware home: today's fixtures as room cards, live rooms in progress, pending pundit picks, retro-set shortcut |
| **Álbum** | Match albums, mega-album, unopened pack queue (badge), pack opening, duplicates + trading |
| **Retro** | Daily retro set, archive of plays you've vitnessed, era browser |
| **La Mesa** | Your mesas: standings (humans + AI pundits), persona feed, weekly podium |

The match room is a pushed screen from Hoy, not a tab. Profile and settings live behind the avatar (team allegiance, share-card history, notification preferences). Tab labels localize (Today/Hoy, Album/Álbum).

## Mesas — the social unit

A **mesa** is a private league: friends join with a 6-character code, and the three AI pundits are automatically seated at every mesa. All prediction and trivia points feed mesa standings, so "beat the table" is literal — some weeks the whole goal is finishing above El Agitador.

- Weekly cycle: matchday points → weekly podium → persona-issued awards (best call, worst miss, chaos award).
- A user can sit at multiple mesas (office, family, friends); solo play works too — the pundits are always there.

## Onboarding (under 60 seconds)

1. Pick your team — flag grid. Personas calibrate banter around it: El Relator becomes *your* relator; rival-team picks get spicier treatment.
2. Tutorial retro jugada: México '86 — a play everyone knows, guaranteed first win.
3. First pack free; first sticker lands in the tutorial album page.
4. Push-permission prompt only after the first pack opens (show value first, ask second).
5. Create or join a mesa (skippable).

## Trivia integrity

- Live jugada trivia: single attempt, ~20-second timer for the full answer set — too short to search reliably, long enough to recall what you just watched.
- Retro jugadas: ~30-second timer; the reconstruction shows **no text clues** (no team names, no year) until answered — an animation cannot be googled.
- Year and play title reveal after answering ("Negrete · Mexico vs Bulgaria · Azteca 1986") — the reveal is the educational payoff and unlocks that play in the Retro archive.
- Cheating only inflates personal coins; mesa standings weight live trivia and predictions, where the timer bites hardest.

## Drop tables (initial tuning)

- Pack = 3 stickers. Per-slot odds: common 70% / rare 25% / golazo 5%.
- Pity timers: every 10th pack guarantees rare+; every 30th guarantees a golazo.
- Match sticker pool, generated at full time: 6 standout players (stats heuristic + persona flavor text on each card), 4 moment cards, 1 MOTM card (mintable only after the vote closes), 1 special golazo card — the match's best jugada as an animated card.
- Expected album completion: ~8–12 packs solo, ~6–8 with trading. All numbers server-tunable.

### Pack-opening protocol (server-rolled, replay-safe)

The roll happens on the backend and is persisted **before** the client shows anything. The animation is pure presentation — killing the app during it can never re-roll.

```
1. Client taps "Open" → POST /packs/{packId}/open
2. Server, in ONE transaction:
     verify ownership AND state = unopened (row lock)
     roll contents (server RNG + pity counters)
     write stickers to inventory
     set pack state = opened_unviewed
3. Server returns the rolled contents
4. Client plays the tear animation with those contents
5. Client confirms reveal shown → state = viewed
```

Failure handling:

- **App killed mid-animation:** pack is already `opened_unviewed`; on relaunch the reveal replays with the same persisted contents. Same result, always.
- **Network drop after the server commits but before the client gets the response:** client retries the same `packId`; server sees `opened_unviewed` and returns the same persisted contents — it never rolls twice (idempotent by pack ID).
- **Spam-tapping Open / two devices opening the same pack:** the row lock + state check make the first request roll and every other request receive that same result.
- Pity counters update inside the same transaction as the roll, so a crash can't desync them.

## Multi-match days

The group stage serves up to four matches a day, some simultaneous (final group round is simultaneous by design). Rooms switch freely; jugada trivia triggers only in the room you're sitting in, while goals elsewhere arrive as push notifications with the ~10-minute grace window. No energy system — generosity fits a one-month event.

---

## Features

### 1. La Jugada — 2D play reconstruction (core)

A notable event happens (MVP: goals only — scorer + assist are reliably in event feeds). The backend converts the event + text commentary into a **play script**: a JSON sequence of waypoints for 2–4 players and the ball. The app animates it on a 2D pitch (react-native-skia): dots move, ball travels, goal flashes.

- **Honest framing:** this is a stylized reconstruction from event data, not real tracking. In-app it's "El Relator draws the play." Licensed tracking data (Opta/SkillCorner) is out of scope.
- **Fallback:** deterministic play-script templates per event type (e.g. "goal from left wing", "counter-attack goal", "penalty") used when LLM reconstruction fails or data is thin.
- **Key plays only — no continuous live simulation.** A minute-by-minute simulated ball would be fiction (no tracking data exists in affordable APIs) and would compete badly with the real broadcast the user is already watching. Instead, between plays the same pitch renders an **ambient layer** that is fully truthful from event data: attack-momentum bar, possession-zone indicator (ball in thirds), and shot pins accumulating into a shotmap. Alive, honest, cheap — and the transformation into a full reconstruction when a goal hits is the dramatic payoff.

### 2. Jugada Trivia — "Who was in the play?" (core, the signature mechanic)

After the reconstruction plays with **anonymous numbered dots** (team colors, no names), the user names the players involved:

- 2–4 question slots: *who started the play / who assisted / who scored*.
- Each slot is a dropdown with 3–4 options: the real player plus distractors drawn from that day's actual lineup, same team and same position group (believable wrong answers).
- Lock answers → reconstruction replays with real names revealed slot by slot.
- **Rewards:** all correct = 2 packs + speed bonus coins; each correct = +25 coins.
- **Data honesty:** scorer and assist come from the events API (reliable). "Who started the play" is parsed from commentary by the LLM; when unavailable the trivia degrades gracefully to 2 slots.
- **Cheat-proofing:** the pre-answer payload is anonymized (paths + distractor lists only — no names, no answer key); the server validates the answer and only then returns the reveal. Issued ~2–3 min after the goal so VAR can't invalidate the answer key. Grace-window (late) plays pay 50%.

### 3. Retro Jugadas — historic trivia (core)

A curated, static dataset of ~60 iconic World Cup plays (1950–2022), each with a hand-verified play script and player metadata. Generated offline (LLM drafts from match reports, manually reviewed) and shipped with the app — zero live-data dependency.

- Each retro jugada asks **who was in the play and what year it happened**: players via dropdowns (same distractor logic as live trivia, drawn from that era's squads), year via a timeline slider notched at World Cup editions (1950–2022, steps of 4). Exact edition = full credit; one tournament off = partial coins.
- Daily set of 3 retro jugadas. Perfect set (all players + all years) = 3 packs.
- Fills dead time between matchdays.
- **Demo insurance:** judging never depends on a live match being in progress.

### 4. Micro-predictions (core)

During live matches, quick 3-option calls ("another goal in the next 10 min?", "card coming?"). Flat coin payout, streak multiplier for consecutive hits.

### 5. Pre-match pundit picks (core)

~3 hours before kickoff the three personas post predictions with 2-line reasoning. The user locks their own pick. Beat all three pundits = 1 pack; points feed mesa standings (see Mesas).

### 6. Sticker packs + match album (core)

- **Pack:** 3 stickers, animated tear-open (reanimated). Costs 100 coins or earned directly.
- **Rarities:** common (players) / rare (moments) / **golazo** — an animated sticker that embeds the play script: tap the card and the goal replays inside it.
- **Pity timer:** every 10th pack guarantees rare or better.
- **Match album:** 12 slots per match — 6 standout players, 4 moments, 1 MOTM, 1 special. Completing it earns a trophy + a bonus pack.
- **Art:** AI-generated illustrations in a retro-poster style. Player names are used (facts), but no photographic likenesses — keeps clear of Panini/FIFA image licensing.

### 7. Tournament mega-album (MVP, thin)

Match albums feed a tournament-wide album: one page per team (48) plus knockout-round pages. End of tournament: a shareable "Mi Mundial" summary card.

### 8. Duplicate trading (MVP, thin)

The soul of figurita culture ("¿la tenés repetida?"). Trade with mesa members: offer duplicate-for-duplicate, push notification, accept/decline. No marketplace, no valuations — playground rules.

### 9. Persona one-liners + TTS (MVP text / stretch audio)

- Text reactions to live events and trivia results, generated once per event and cached (one LLM call serves all users).
- **TTS (build last):** goal calls and a 60–90s post-match recap in El Relator's voice. One TTS render per match, cached.

### 10. Shareable recap card (MVP, thin)

Post-match auto-generated image: trivia accuracy, best pull, album progress, one persona roast quote. `react-native-view-shot` → native share sheet.

---

## Economy

Single soft currency (coins) plus direct pack drops for headline wins:

| Action | Reward |
|--------|--------|
| Micro-prediction hit | +50 coins |
| Trivia, per correct slot | +25 coins |
| Live trivia perfect | 2 packs |
| Retro set perfect | 3 packs |
| Beat all three pundits | 1 pack |
| Complete a match album | 1 bonus pack + trophy |
| Daily login | +100 coins |
| Pack price | 100 coins |

---

## Architecture

```
pnpm monorepo
├── apps/mobile          Expo React Native (expo-router)
│     skia (pitch sim) · reanimated (packs) · expo-notifications
│     react-query + zustand
├── supabase/            The entire backend (no separate API server)
│     migrations/        schema, RLS policies, Postgres functions
│     functions/         Deno edge functions:
│       poller           fetch live events (pg_cron, 1/min)
│       compose-play     template + LLM waypoint fill
│       submit-answer    trivia validation + rewards
│       personas         one-liners, pundit picks (cached)
└── packages/shared      play-script schema (Zod), domain types,
                         StatsBomb retro compiler (offline script)
```

### Hosting (decided)

**Backend = Supabase only.** One platform already in the plan for auth + Postgres + realtime; its free tier carries the whole hackathon: 2 projects, 500 MB database, 50K monthly auth users, 500K edge-function invocations/month. Our worst case is tiny: poller at 1 call/min ≈ 43K invocations/month, user actions at hackathon scale are noise.

- **Pack rolls, trades, coin grants** → Postgres functions: transactional by nature, exactly what the pack-opening protocol requires.
- **Poller** → edge function on a pg_cron schedule (every minute). The VAR confirmation delay (~2–3 min) makes 15-second polling pointless — 60-second cadence loses nothing.
- **LLM + TTS calls** → edge functions with secrets server-side; Deno supports npm imports for the Anthropic SDK.
- **Realtime fan-out** → Supabase Realtime channels (mesa-scoped), already RLS-aware.

**Local development:** `supabase start` runs the full stack in Docker (Postgres, auth, realtime, edge functions) — work offline, free, no deploy loop; Expo app points at the LAN address. Deploying to the cloud project is `supabase db push` + `supabase functions deploy` — same code, no drift.

**Plan B** (only if edge functions get cramped): Render's free web service for a standalone poller — the one platform left with a real ongoing free tier (cold-starts on idle; needs a keep-alive ping). Railway and Fly.io are trial-only now. Not needed at current scope.

### Data providers (verified June 2026)

**Retro mode → StatsBomb Open Data** ([github.com/statsbomb/open-data](https://github.com/statsbomb/open-data), free with attribution):
- Real event-level data with x/y coordinates (120×80 pitch grid) for FIFA World Cup **1958, 1962, 1970, 1974, 1986, 1990, 2018, 2022**, plus Euro 2020/2024, Copa América 2024 and more. Every pass, carry, dribble and shot in a goal's possession chain has locations and timestamps; some matches include 360 freeze-frames (surrounding player positions).
- Retro jugadas are therefore **exact reconstructions, not LLM guesses** — Maradona '86 animated from the genuine event sequence. A deterministic offline compiler (TypeScript) walks the possession chain ending in each famous goal and emits play-script JSON directly. The LLM is only used for distractor selection and flavor copy.
- License: free for non-commercial use with attribution — fine for the hackathon; a commercial launch would need a licensing conversation.

**Live mode → API-Football** ([api-football.com](https://www.api-football.com/), covers WC 2026):
- Live fixture events updated ~15s server-side: goals with scorer **and assist**, cards, substitutions, VAR; lineups with formations and player positions; match statistics.
- Free tier: 100 requests/day, all endpoints — enough for development against one live match/day (1 call/min ≈ 105 calls/match). Tournament/demo weeks need a paid tier or the replay engine.
- Live play scripts are **stylized**: facts (scorer, assist, minute, lineup positions) anchor a template skeleton chosen by goal type (open play / counter / penalty / own goal); the LLM fills plausible waypoints, Zod-validated with template-only fallback. Honest framing preserved: live = illustration, retro = real data.

**Supplements:** [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json) — public-domain WC 2026 schedule/squad static JSON (seed data, zero API cost). football-data.org demoted to fallback (free tier is delayed-score only, no lineups).

### Play-script pipeline

```
RETRO (offline, build time)
StatsBomb events → possession chain of famous goal → map 120×80 coords
→ play-script JSON (deterministic) → manual review → ship in app bundle

LIVE (runtime)
poller (15s) → new goal event → scorer/assist + lineup positions
→ template skeleton by goal type → LLM waypoint fill (Zod-validated,
   template fallback) → play-script JSON → Supabase realtime → app
```

One play-script format powers everything: the sim, the trivia (names stripped), and golazo sticker replays.

- **Replay engine:** recorded event JSON of a finished match replayed at accelerated speed — used for development, rehearsal, and as a demo fallback.
- **LLM usage:** check the claude-api skill for current model ids and pricing before implementation. All generations are cached per event/match — costs scale with matches, not users.

## Development workflow (QAF)

1. Scaffold monorepo, commit baseline.
2. `./qubika-agentic-framework/scripts/initialize-project.sh` → CLAUDE.md + llm-wiki.
3. One `/create-sdd-ticket` per feature below, implemented via `/implement-ticket`.

### Build order (risk-first)

1. Data layer + match room (poller, events feed, replay engine)
2. Jugada sim renderer + play-script format + templates
3. Jugada trivia + rewards
4. Packs + match album
5. Retro jugadas dataset + mode
6. Micro-predictions
7. Pundit picks + persona one-liners
8. Mega-album + trading
9. Recap card + TTS

Each tier leaves a complete, demoable product.

## Demo script (90 seconds)

1. Open live match room — momentum bar moving, real fixture.
2. Goal replay draws itself; dots are anonymous.
3. Judge guesses who was in the play — reveal animation, 2 packs won.
4. Pack tear → golazo sticker drops → tap it, the goal replays inside the card.
5. Match album page completes; El Agitador roasts a wrong guess.
6. Retro jugada: México '86 — show it works with zero live dependency.

## Security & edge cases

Design decisions adopted from this analysis (these change the spec):

1. **Server-authoritative everything.** Trivia validation, timers, pack RNG, pity counters, coin balances, trade execution — all server-side. The client renders; it never decides.
2. **Anonymized trivia payload.** The play script sent before answering contains only dot paths and the distractor lists — real player names and the correct mapping arrive from the server *after* the answer is submitted. A cheater inspecting network traffic finds nothing.
3. **VAR confirmation delay.** Live trivia is issued ~2–3 minutes after the goal event (or once the provider clears the VAR flag), so disallowed goals don't mint trivia with a wrong answer key. If a correction lands after rewards were paid: rewards are never clawed back; sticker metadata is regenerated.
4. **Grace-window trivia pays half.** The 10-minute late window stays (busy users), but at 50% rewards — the answer is googleable by then.
5. **Trading is constrained by design.** Duplicate-for-duplicate, within a mesa only, atomic DB transaction (both stickers locked, no double-spend of the same duplicate across two trades), no free-text messages — preset emotes only. Constraints kill the alt-account funnel, the scam vector, and the moderation problem at once.
6. **Earned-only packs, no IAP.** No real money in, no cash-out, no paid loot boxes — keeps the app clear of gambling/loot-box regulation and app-store complications.

### Threat & edge-case register

**Game integrity**

| Case | Handling |
|------|----------|
| Client reports fake wins | Server validates answers against its own answer key; client never sends "I won" |
| Timer spoofing | Server timestamps question issue + answer receipt; rejects outside window (+ small network grace) |
| Double-submit / replay of answers | Idempotency keys; unique constraint (user, jugada) |
| Daily-reward clock tricks | Day boundaries computed server-side, fixed timezone |
| Retro answers shared between users | Per-user shuffled option order; each user's daily 3 drawn from a larger pool; live trivia dominates mesa scoring |
| Multi-account sticker farming | Trading constraints (above) + join rate limits; device-level limits if it ever matters post-hackathon |
| Pack odds manipulation | RNG + pity counters server-side only |

**Data & match-state edge cases**

| Case | Handling |
|------|----------|
| Goal disallowed by VAR after event fired | Confirmation delay before trivia; corrections never claw back rewards |
| Unassisted goal / penalty / own goal | Template variants: fewer trivia slots; own goals skip trivia at MVP |
| Lineups late or missing | Distractors fall back from starting XI to full squad list |
| Duplicate events from poller | Dedupe on provider event ID/hash |
| Provider outage mid-match | Room degrades to ambient-only; trivia resumes on recovery; replay engine for demos |
| Same-name players (Hernández × 2) | Provider player IDs as truth; display names disambiguated with initials |
| Match postponed / abandoned | Room state machine includes those states; open predictions void with notification, no penalty |
| Extra time / penalty shootouts | Phase machine handles ET/PENS; shootout-specific content is stretch, but nothing breaks |
| Old StatsBomb tournaments with partial coverage | Curate only plays with complete possession chains; hand-author the rest |
| Rate-limit exhaustion | Poller backoff + priority to live matches; paid key for tournament weeks |

**LLM-specific**

| Case | Handling |
|------|----------|
| Prompt injection via API text (commentary, names) | External data passed as structured fields, never as instructions; outputs Zod-validated; player names allowlisted from lineup |
| Hallucinated/out-of-bounds waypoints | Coordinate clamping + schema validation + deterministic template fallback |
| Persona roasts turning toxic | Tone rules + banned-topic list in system prompts; output cached and reviewable; kill-switch to canned lines |
| LLM cost abuse | No user input ever triggers a generation; everything is generated once per event/match and cached |

**Platform security**

| Case | Handling |
|------|----------|
| Data access | Supabase Auth + row-level security: users read own stickers/coins, mesa data only as members |
| Trade authorization | Server verifies both parties own the offered duplicates inside one transaction |
| Mesa code brute-force | Rate-limited joins, member cap, regenerable codes, kick capability |
| Realtime channel snooping | Channel subscriptions scoped: mesa channels members-only, user channels private |
| Secrets | API-Football / Claude / TTS keys live server-side only; never shipped in the app bundle |
| Push tokens | Stored per device, never exposed via API responses |
| Endpoint abuse | Per-user and per-IP rate limits, strictest on answer submission and trade offers |
| Young audience (WC reaches kids) | No free text anywhere (emote-only trading), minimal PII (display name + avatar), no DMs |

**Client resilience**

| Case | Handling |
|------|----------|
| App killed mid pack-opening | Roll committed server-side first; reopening shows the result — animation is presentation, not state |
| Offline during match | Resync on reconnect; missed trivia available via grace window at grace rewards |
| Two devices, one account | Server constraints make the first answer win; state syncs via realtime |
| Mid-tournament joiner | Retro backlog acts as natural catch-up content |

## Risks

| Risk | Mitigation |
|------|------------|
| API rate limits / WC coverage gaps | Provider abstraction + single poller + replay engine |
| LLM reconstruction quality | Template fallback per event type; goals-only at MVP |
| Demo timing vs match schedule | Retro mode + replay engine never need a live match |
| Image-gen cost/quality for stickers | Pre-generate sticker art per matchday batch, not on demand |
| Player likeness IP | Illustrated art style, no photos |
| TTS cost/latency | One cached render per match; last build priority |
