# VIT-4: Jugada trivia — "who was in the play?"

> Build-order #3 from [`docs/CONCEPT.md`](../CONCEPT.md). The signature mechanic.
> After watching a goal's reconstruction (VIT-3), the player names who was in the
> play; correct answers earn coins and packs. **Server-authoritative** per the
> security model: the client never sees the answer key.

## User Story

**As a** fan who just watched a goal
**I want** to be quizzed on who was in the play and rewarded for getting it right
**So that** paying attention turns into coins and sticker packs — the core loop.

## Scope

In:
- Server-side jugada challenges: jugada rows (play-script + per-slot options +
  answer key) seeded for the ARG-MEX goals; a `jugada_challenges` view exposes
  everything **except** the answer key.
- `submit-answer` edge function: validates answers against the server-held key,
  records a single attempt, awards coins (per correct slot) and a pack (perfect),
  returns the reveal.
- Profiles auto-created on sign-in (trigger) so coins/packs have an owner.
- Mobile trivia flow: anonymized pitch (no shirt numbers), a dropdown per quizzed
  slot, lock → reveal + rewards; a coins balance in the match room.

Out (later tickets):
- Retro trivia + the year slider; live-match trivia timers/grace window.
- Pack opening UI + album (open_pack exists; this only grants packs).
- compose-play generation (challenges are seeded from the hand-authored scripts).

## Acceptance Criteria

### Scenario 1: Correct answers earn rewards (happy path)

```gherkin
Given a goal with a jugada challenge and the user signed in
When the user opens it, the pitch dots are anonymous (no numbers)
And the user picks the correct player for each slot and locks answers
Then submit-answer grades them server-side
And the real names are revealed on the dots
And coins are credited (25 per correct slot) and a pack granted for a perfect set
And the coins balance updates
```

### Scenario 2: The client never receives the answer key (security)

```gherkin
Given the jugada_challenges view and RLS
When the client fetches a challenge
Then it receives the slot options but NOT the answer key
And answer validation happens only in the submit-answer edge function
And a forged "all correct" client request is graded against the server key, not trusted
```

### Scenario 3: One attempt per jugada (idempotency)

```gherkin
Given the user already answered a jugada
When they submit again
Then the server returns the original result and does not double-award coins or packs
```

### Scenario 4: Partial credit

```gherkin
Given two quizzed slots
When the user gets one right and one wrong
Then 25 coins are awarded, no pack, and the reveal shows which was wrong
```

## Technical Context

### Current state
- `jugadas`, `trivia_attempts`, `profiles`, `packs` tables exist (VIT-1) with RLS; `answer_key`/`distractors`/`play_script` columns on `jugadas`.
- `open_pack` + economy constants exist; no coin/pack granting wired yet.
- VIT-3 renderer draws a PlayScript; demo scripts are client-side.
- No profile is created on anonymous sign-in.

### Proposed changes

**Backend (migrations):**
- `handle_new_user` trigger → insert a `profiles` row on `auth.users` insert; add own-profile RLS select policy.
- `jugadas`: add `provider_event_id` (links a challenge to a goal event).
- `jugada_challenges` view: `id, match_id, provider_event_id, minute, title, distractors` (no `answer_key`, no name-bearing `play_script`); select policy + grant for `authenticated`.

**Seed:** `supabase/seed/jugadas/seed-jugadas.ts` (service role) upserts a jugada per ARG-MEX goal: `play_script` (full), `distractors` = `[{ slotId, role, prompt, options:[{id,label}] }]`, `answer_key` = `{ slotId: correctOptionId }`.

**Edge function `submit-answer`:** input `{ jugadaId, answers }`; load the jugada (service role), grade, upsert `trivia_attempts` (unique `(jugada,profile)` → idempotent), award coins + pack (transactional via an RPC), return `{ correctSlots, total, reveal, coinsAwarded, packsAwarded }`.

**Mobile:**
- `use-coins.ts` (read own profile coins).
- `use-jugada-trivia.ts` (fetch challenge by providerEventId from the view; submit via `supabase.functions.invoke`).
- Trivia UI in the jugada overlay: anonymized canvas (hide numbers until revealed), a dropdown per slot, Lock → result + reveal + rewards.
- Match room: a coins chip; tapping a goal opens trivia.

### Architecture decisions

| Decision | Rationale |
|----------|-----------|
| Answer key server-only; client gets a view without it | Core anti-cheat from CONCEPT.md — a network inspector finds no answers. |
| Grade in submit-answer, award via SECURITY DEFINER RPC | Single transaction for attempt + coins + pack; idempotent on re-submit. |
| Play-script (drawing) stays client-side; only Q&A is server-side | Positions aren't secret; only the slot→name mapping is. Minimises what moves server-side. |
| Profiles auto-created by trigger | Everything downstream (coins, packs, mesas) needs a profile row. |

## Out Of Scope / Edge Cases
- Answer for a slot whose option list changed → server validates against current key.
- Submitting with missing slots → graded as wrong for those slots, no crash.
- No profile row (shouldn't happen post-trigger) → RPC creates one defensively.

## Definition Of Done
- `pnpm --filter mobile typecheck` + `pnpm test` pass.
- Backend verified deterministically (psql/curl): challenge view hides the key; submit-answer grades correctly, is idempotent, awards coins/pack.
- On web: open a goal, answer the quiz, see reveal + coins update; screenshot.
- README note on the trivia flow + that challenges are seeded.

## References
- [`docs/CONCEPT.md`](../CONCEPT.md) § Jugada Trivia, § Trivia integrity, § Economy, § Security.
- VIT-1 schema (`jugadas`, `trivia_attempts`, `profiles`, `packs`), VIT-3 renderer.

**BDD Scenarios**: 4
