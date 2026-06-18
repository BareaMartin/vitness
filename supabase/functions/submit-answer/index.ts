import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

/**
 * submit-answer — server-authoritative trivia grading.
 *
 * The client posts its chosen options; this loads the jugada's answer_key with
 * the service role (RLS hides it from clients), grades the attempt, then awards
 * coins/packs idempotently via record_trivia_attempt (called with the user's JWT
 * so auth.uid() resolves). A forged "all correct" payload is graded against the
 * server key, never trusted. See docs/CONCEPT.md § Trivia integrity.
 */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return jsonResponse({ error: "missing authorization" }, 401);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return jsonResponse({ error: "unauthorized" }, 401);

  let body: { jugadaId?: string; answers?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json" }, 400);
  }
  const { jugadaId, answers } = body;
  if (!jugadaId || typeof answers !== "object" || answers === null) {
    return jsonResponse({ error: "jugadaId and answers are required" }, 400);
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: jugada, error: loadError } = await admin
    .from("jugadas")
    .select("answer_key")
    .eq("id", jugadaId)
    .maybeSingle();
  if (loadError) return jsonResponse({ error: loadError.message }, 500);
  if (!jugada) return jsonResponse({ error: "jugada not found" }, 404);

  const answerKey = jugada.answer_key as Record<string, string>;
  const slotIds = Object.keys(answerKey);
  const total = slotIds.length;
  let correct = 0;
  for (const slot of slotIds) {
    if (answers[slot] === answerKey[slot]) correct += 1;
  }

  const coins = correct * 25;
  const packs = total > 0 && correct === total ? 2 : 0;
  const issuedAt = new Date().toISOString();

  const { data: awardRows, error: awardError } = await userClient.rpc("record_trivia_attempt", {
    p_jugada_id: jugadaId,
    p_answers: answers,
    p_correct: correct,
    p_total: total,
    p_coins: coins,
    p_packs: packs,
    p_issued_at: issuedAt,
  });
  if (awardError) return jsonResponse({ error: awardError.message }, 500);

  const award = Array.isArray(awardRows) ? awardRows[0] : awardRows;

  return jsonResponse({
    correctSlots: correct,
    totalSlots: total,
    reveal: answerKey,
    coinsAwarded: award?.coins_awarded ?? 0,
    packsAwarded: award?.packs_awarded ?? 0,
    alreadyDone: award?.already_done ?? false,
  });
});
