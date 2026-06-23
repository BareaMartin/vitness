-- Allow authenticated users to read their own trivia attempts.
-- Needed so the client can determine which golazo moments have been unlocked
-- (solved trivia = mask lifted on golazo card title / player name).
create policy "read own trivia attempts"
  on trivia_attempts for select
  to authenticated
  using (profile_id = auth.uid ());
