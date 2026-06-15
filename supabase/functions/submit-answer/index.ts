import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

/**
 * submit-answer — server-authoritative trivia validation.
 *
 * The client never claims a win. It posts its chosen answers; this function
 * loads the jugada's answer_key (which RLS hides from clients), grades the
 * attempt, applies the late-window penalty, awards coins/packs, and persists a
 * single-shot attempt row. See docs/CONCEPT.md "Trivia integrity".
 *
 * Full grading + reward logic is implemented in its own ticket; this is the
 * wired skeleton (auth, request shape, idempotency surface).
 */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return jsonResponse({ error: "missing authorization" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonResponse({ error: "unauthorized" }, 401);

  return jsonResponse({ error: "not implemented" }, 501);
});
