import { jsonResponse } from "../_shared/cors.ts";

/**
 * compose-play — turns a live goal event into a PlayScript.
 *
 * Facts (scorer, assist, minute, lineup positions) anchor a template skeleton
 * chosen by goal type (open play / counter / penalty / own goal); the LLM fills
 * plausible waypoints, validated against the @vitness/shared PlayScript schema
 * with a deterministic template-only fallback. Retro plays bypass this — they
 * are compiled offline from StatsBomb data. See docs/CONCEPT.md "Play-script
 * pipeline".
 *
 * Implemented in the sim/reconstruction ticket; this is the wired skeleton.
 */
Deno.serve(async () => {
  return jsonResponse({ error: "not implemented" }, 501);
});
