-- VITNESS initial schema
-- Server-authoritative data model: the client renders, the server decides.
-- See docs/CONCEPT.md "Security & edge cases" and "Pack-opening protocol".

-- ============================================================================
-- Enums
-- ============================================================================

create type sticker_rarity as enum ('common', 'rare', 'golazo');
create type pack_state as enum ('unopened', 'opened_unviewed', 'viewed');
create type jugada_source as enum ('live', 'retro');
create type trade_state as enum ('offered', 'accepted', 'declined', 'cancelled', 'expired');

-- ============================================================================
-- Profiles (1:1 with auth.users)
-- ============================================================================

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  team_code text,
  coins integer not null default 0 check (coins >= 0),
  pity_since_rare integer not null default 0,
  pity_since_golazo integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Mesas (private leagues)
-- ============================================================================

create table mesas (
  id uuid primary key default gen_random_uuid (),
  name text not null check (char_length(name) between 2 and 40),
  join_code char(6) not null unique,
  owner_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table mesa_members (
  mesa_id uuid not null references mesas (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  joined_at timestamptz not null default now(),
  primary key (mesa_id, profile_id)
);

create index mesa_members_profile_idx on mesa_members (profile_id);

-- ============================================================================
-- Matches + jugadas (plays) + trivia
-- ============================================================================

create table matches (
  id text primary key,
  provider_match_id text,
  home_team text not null,
  away_team text not null,
  kickoff_at timestamptz not null,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

-- A jugada is one reconstructed play. play_script holds the animation waypoints
-- (the @vitness/shared PlayScript schema). answer_key is never sent to clients
-- before submission — RLS denies select on it; reads go through edge functions.
create table jugadas (
  id uuid primary key default gen_random_uuid (),
  source jugada_source not null,
  match_id text references matches (id) on delete cascade,
  minute integer,
  title text,
  play_year integer,
  play_script jsonb not null,
  answer_key jsonb not null,
  distractors jsonb not null,
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index jugadas_match_idx on jugadas (match_id);

-- One row per user attempt. Unique (jugada, profile) makes answers idempotent
-- and single-shot — replaying a submission cannot double-reward.
create table trivia_attempts (
  id uuid primary key default gen_random_uuid (),
  jugada_id uuid not null references jugadas (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  answers jsonb not null,
  correct_slots integer not null,
  total_slots integer not null,
  is_late boolean not null default false,
  coins_awarded integer not null default 0,
  issued_at timestamptz not null,
  submitted_at timestamptz not null default now(),
  unique (jugada_id, profile_id)
);

-- ============================================================================
-- Stickers + packs + inventory
-- ============================================================================

-- Catalog of collectible stickers (player / moment / motm / golazo cards).
create table stickers (
  id uuid primary key default gen_random_uuid (),
  match_id text references matches (id) on delete cascade,
  album_slot integer not null,
  rarity sticker_rarity not null,
  title text not null,
  subtitle text,
  art_url text,
  embedded_jugada_id uuid references jugadas (id) on delete set null,
  created_at timestamptz not null default now()
);

create index stickers_match_idx on stickers (match_id);

-- A pack belongs to a user and is rolled server-side. State machine:
-- unopened -> opened_unviewed (roll committed) -> viewed (reveal shown).
create table packs (
  id uuid primary key default gen_random_uuid (),
  profile_id uuid not null references profiles (id) on delete cascade,
  state pack_state not null default 'unopened',
  source text not null,
  match_id text references matches (id) on delete set null,
  created_at timestamptz not null default now(),
  opened_at timestamptz
);

create index packs_profile_state_idx on packs (profile_id, state);

-- Owned stickers. count tracks duplicates; provenance is the VITNESSED stamp.
create table user_stickers (
  profile_id uuid not null references profiles (id) on delete cascade,
  sticker_id uuid not null references stickers (id) on delete cascade,
  count integer not null default 1 check (count >= 0),
  provenance text,
  first_earned_at timestamptz not null default now(),
  primary key (profile_id, sticker_id)
);

-- Stickers produced by opening a specific pack (audit + reveal replay).
create table pack_contents (
  pack_id uuid not null references packs (id) on delete cascade,
  slot integer not null,
  sticker_id uuid not null references stickers (id) on delete cascade,
  primary key (pack_id, slot)
);

-- ============================================================================
-- Trades (mesa-scoped, duplicate-for-duplicate, emote-only)
-- ============================================================================

create table trades (
  id uuid primary key default gen_random_uuid (),
  mesa_id uuid not null references mesas (id) on delete cascade,
  from_profile uuid not null references profiles (id) on delete cascade,
  to_profile uuid not null references profiles (id) on delete cascade,
  offered_sticker uuid not null references stickers (id) on delete cascade,
  requested_sticker uuid not null references stickers (id) on delete cascade,
  state trade_state not null default 'offered',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index trades_to_profile_idx on trades (to_profile, state);

-- ============================================================================
-- updated row-level security is enabled per table; policies live in the
-- next migration so this file stays a clean structural baseline.
-- ============================================================================

alter table profiles enable row level security;
alter table mesas enable row level security;
alter table mesa_members enable row level security;
alter table matches enable row level security;
alter table jugadas enable row level security;
alter table trivia_attempts enable row level security;
alter table stickers enable row level security;
alter table packs enable row level security;
alter table user_stickers enable row level security;
alter table pack_contents enable row level security;
alter table trades enable row level security;
