-- VIT-4 jugada trivia: profile bootstrap, challenge view (answer-key-free), and
-- the transactional, idempotent award RPC. See docs/CONCEPT.md § Trivia
-- integrity and ticket VIT-4.

-- ---------------------------------------------------------------------------
-- Profiles are auto-created on sign-in so coins/packs/mesas have an owner.
-- ---------------------------------------------------------------------------

create or replace function handle_new_user ()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Hincha'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user ();

create policy "read own profile"
  on profiles for select
  to authenticated
  using (id = auth.uid ());

-- ---------------------------------------------------------------------------
-- Link a jugada challenge to the goal event it reconstructs.
-- ---------------------------------------------------------------------------

alter table jugadas add column provider_event_id text;
create index jugadas_provider_event_idx on jugadas (provider_event_id);

-- ---------------------------------------------------------------------------
-- The client-facing challenge: everything EXCEPT the answer key and the
-- name-bearing play_script. Owned by the definer role so it reads jugadas
-- (which denies authenticated via RLS) and exposes only safe columns.
-- ---------------------------------------------------------------------------

create view jugada_challenges as
  select id, match_id, provider_event_id, minute, title, distractors
  from jugadas;

grant select on jugada_challenges to authenticated, anon;

-- ---------------------------------------------------------------------------
-- record_trivia_attempt: one transaction for the attempt + coin/pack award.
-- Idempotent — a repeat submission returns the stored result and awards
-- nothing further (unique (jugada_id, profile_id) on trivia_attempts).
-- Grading is done by the submit-answer edge function (where the key lives);
-- this only persists the outcome.
-- ---------------------------------------------------------------------------

create or replace function record_trivia_attempt (
  p_jugada_id uuid,
  p_answers jsonb,
  p_correct integer,
  p_total integer,
  p_coins integer,
  p_packs integer,
  p_issued_at timestamptz
)
returns table (coins_awarded integer, packs_awarded integer, already_done boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile uuid := auth.uid();
  v_existing trivia_attempts%rowtype;
  v_match_id text;
  i integer;
begin
  if v_profile is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into v_existing from trivia_attempts
    where jugada_id = p_jugada_id and profile_id = v_profile;

  if found then
    return query select v_existing.coins_awarded, 0, true;
    return;
  end if;

  insert into trivia_attempts (jugada_id, profile_id, answers, correct_slots, total_slots, coins_awarded, issued_at)
  values (p_jugada_id, v_profile, p_answers, p_correct, p_total, p_coins, p_issued_at);

  update profiles set coins = coins + p_coins where id = v_profile;

  select match_id into v_match_id from jugadas where id = p_jugada_id;
  i := 0;
  while i < p_packs loop
    insert into packs (profile_id, source, match_id) values (v_profile, 'trivia', v_match_id);
    i := i + 1;
  end loop;

  return query select p_coins, p_packs, false;
end;
$$;

revoke all on function record_trivia_attempt (uuid, jsonb, integer, integer, integer, integer, timestamptz) from public;
grant execute on function record_trivia_attempt (uuid, jsonb, integer, integer, integer, integer, timestamptz) to authenticated, service_role;
