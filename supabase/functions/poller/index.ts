import { jsonResponse } from "../_shared/cors.ts";

/**
 * poller — fetches live fixture events from a live football-data provider on a
 * pg_cron schedule (every minute). New goal events are deduped by provider event
 * id, then handed to compose-play. Polls at 60s because the VAR confirmation
 * delay makes faster cadence pointless. Concrete provider is TBD (no free source
 * exposes WC 2026 events); the replay engine drives dev + demo meanwhile.
 * See docs/CONCEPT.md "Data providers" + "Match rhythm".
 *
 * Implemented in the data-layer ticket; this is the wired skeleton.
 */
Deno.serve(async () => {
  return jsonResponse({ error: "not implemented" }, 501);
});
