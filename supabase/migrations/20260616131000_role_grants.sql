-- Role grants for the Supabase API roles. Migrations don't reliably inherit
-- Supabase's default privileges, so app tables ship without DML grants and
-- PostgREST calls fail with "permission denied for table". Grant explicitly.
--
-- Security model (docs/CONCEPT.md § Security): the server decides. service_role
-- is the trusted server identity (edge functions, replay runner, admin tooling)
-- and bypasses RLS — it gets full access; its key never ships to the client.
-- authenticated reaches data ONLY through RLS policies, so a table-level SELECT
-- floor is granted and RLS narrows it; writes happen via SECURITY DEFINER
-- functions (e.g. open_pack) or service_role, not direct authenticated DML.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all routines in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on routines to service_role;

grant select on all tables in schema public to authenticated;
alter default privileges in schema public grant select on tables to authenticated;

-- Match data is public within the app. match_events already has its read policy
-- in its own migration; matches needs one too so the match room can read it.
create policy "authenticated can read matches"
  on matches for select
  to authenticated
  using (true);
