-- Publish match + match_events changes over Supabase Realtime so the match room
-- receives INSERTs live as the replay engine (or future poller) writes them.
-- RLS still governs what each subscriber may receive. See ticket VIT-2.

alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table match_events;
