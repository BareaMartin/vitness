import { jsonResponse } from "../_shared/cors.ts";

/**
 * personas — generates La Mesa pundit content: pre-match picks, live one-liner
 * reactions, trivia roasts, weekly awards. Generated once per event and cached,
 * so one Claude call serves every user. Tone rules + a banned-topic list live in
 * the system prompts, with a kill-switch to canned lines. See docs/CONCEPT.md
 * "The cast: La Mesa" + LLM threat handling.
 *
 * Implemented in the personas ticket; this is the wired skeleton.
 */
Deno.serve(async () => {
  return jsonResponse({ error: "not implemented" }, 501);
});
