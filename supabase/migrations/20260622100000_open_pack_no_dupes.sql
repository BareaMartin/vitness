-- Prevent duplicate stickers within a single pack opening.
-- Tracks already-picked IDs in v_picked_ids and excludes them from each
-- subsequent slot's random draw. If the entire rarity pool is exhausted
-- (edge case: tiny pool), it falls back to allowing a repeat rather than
-- erroring out.

create or replace function open_pack (p_pack_id uuid)
returns table (slot integer, sticker_id uuid)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_profile uuid := auth.uid();
  v_match_id text;
  v_state pack_state;
  v_pity_rare integer;
  v_pity_legendary integer;
  v_slot integer;
  v_roll double precision;
  v_rarity sticker_rarity;
  v_sticker uuid;
  v_picked_ids uuid[] := ARRAY[]::uuid[];
begin
  select p.state, p.match_id into v_state, v_match_id
  from packs p
  where p.id = p_pack_id and p.profile_id = v_profile
  for update;

  if not found then
    raise exception 'pack not found or not owned' using errcode = 'P0002';
  end if;

  if v_state <> 'unopened' then
    return query
      select pc.slot, pc.sticker_id from pack_contents pc where pc.pack_id = p_pack_id
      order by pc.slot;
    return;
  end if;

  select coins_pity.pity_since_rare, coins_pity.pity_since_legendary
    into v_pity_rare, v_pity_legendary
  from profiles coins_pity
  where coins_pity.id = v_profile
  for update;

  for v_slot in 0..2 loop
    v_roll := random();

    if v_pity_legendary >= 11 then
      v_rarity := 'legendary';
    elsif v_pity_rare >= 8 then
      v_rarity := (case when v_roll < 0.25 then 'legendary' else 'rare' end)::sticker_rarity;
    elsif v_roll < 0.12 then
      v_rarity := 'legendary';
    elsif v_roll < 0.42 then
      v_rarity := 'rare';
    else
      v_rarity := 'common';
    end if;

    if v_rarity = 'legendary' then
      v_pity_legendary := 0;
      v_pity_rare := 0;
    elsif v_rarity = 'rare' then
      v_pity_rare := 0;
      v_pity_legendary := v_pity_legendary + 1;
    else
      v_pity_rare := v_pity_rare + 1;
      v_pity_legendary := v_pity_legendary + 1;
    end if;

    -- Prefer a sticker not already in this pack (no same-pack dupes).
    select s.id into v_sticker
    from stickers s
    where s.roll_rarity = v_rarity
      and (v_match_id is null or s.match_id = v_match_id or s.match_id is null)
      and s.id != all(v_picked_ids)
    order by random()
    limit 1;

    -- Fallback: pool exhausted for this rarity → allow a repeat rather than error.
    if v_sticker is null then
      select s.id into v_sticker
      from stickers s
      where s.roll_rarity = v_rarity
        and (v_match_id is null or s.match_id = v_match_id or s.match_id is null)
      order by random()
      limit 1;
    end if;

    if v_sticker is null then
      select s.id into v_sticker from stickers s where s.roll_rarity = v_rarity order by random() limit 1;
    end if;

    if v_sticker is null then
      raise exception 'no sticker available for rarity %', v_rarity using errcode = 'P0001';
    end if;

    v_picked_ids := v_picked_ids || v_sticker;

    insert into pack_contents (pack_id, slot, sticker_id) values (p_pack_id, v_slot, v_sticker);

    insert into user_stickers (profile_id, sticker_id, count, provenance)
    values (v_profile, v_sticker, 1, 'VITNESSED · pack')
    on conflict (profile_id, sticker_id)
    do update set count = user_stickers.count + 1;
  end loop;

  update profiles
    set pity_since_rare = v_pity_rare, pity_since_legendary = v_pity_legendary
  where id = v_profile;

  update packs set state = 'opened_unviewed', opened_at = now() where id = p_pack_id;

  return query
    select pc.slot, pc.sticker_id from pack_contents pc where pc.pack_id = p_pack_id
    order by pc.slot;
end;
$$;

revoke all on function open_pack (uuid) from public;
grant execute on function open_pack (uuid) to authenticated;
