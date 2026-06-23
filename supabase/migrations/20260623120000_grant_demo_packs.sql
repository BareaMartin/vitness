-- Grant a fresh player a one-time allotment of real, openable packs so the
-- collection loop works without earning trivia first. Replaces the client-side
-- "mock pack" hack: these are real rows, so open_pack persists the rolled cards
-- to user_stickers and the album actually fills. Idempotent per profile (the
-- demo allotment is granted only once, keyed by source='demo'). match_id is
-- null so the roll draws from the whole tournament pool (any country).

create or replace function grant_demo_packs (p_count integer default 20)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile uuid := auth.uid();
  v_existing integer;
begin
  if v_profile is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select count(*) into v_existing
  from packs
  where profile_id = v_profile and source = 'demo';

  if v_existing > 0 or p_count <= 0 then
    return 0;
  end if;

  insert into packs (profile_id, source, state, match_id)
  select v_profile, 'demo', 'unopened', null
  from generate_series(1, p_count);

  return p_count;
end;
$$;

revoke all on function grant_demo_packs (integer) from public;
grant execute on function grant_demo_packs (integer) to authenticated;
