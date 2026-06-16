-- match_events: the durable event cache the replay engine and (later) the live
-- poller write into. unique (match_id, provider_event_id) makes replay
-- idempotent and dedups the poller in one constraint. See docs/CONCEPT.md
-- § Data providers and ticket VIT-1.

create table match_events (
  id uuid primary key default gen_random_uuid (),
  match_id text not null references matches (id) on delete cascade,
  provider_event_id text not null,
  type text not null,
  team text not null,
  minute integer not null check (minute between 0 and 130),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (match_id, provider_event_id)
);

create index match_events_match_minute_idx on match_events (match_id, minute);

alter table match_events enable row level security;

-- Match data is public within the app: any authenticated user may read events.
create policy "authenticated can read match events"
  on match_events for select
  to authenticated
  using (true);
