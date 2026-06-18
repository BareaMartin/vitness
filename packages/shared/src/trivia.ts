import { z } from "zod";
import { TriviaSlotSchema } from "./play-script.ts";

/**
 * Trivia wire types shared by the seed, the submit-answer edge function, and the
 * app. The challenge (slots + options) is public; the answer key is server-only.
 * See docs/CONCEPT.md § Trivia integrity and ticket VIT-4.
 */

/** The answer-key-free challenge the client fetches from jugada_challenges. */
export const JugadaChallengeSchema = z.object({
  id: z.string(),
  match_id: z.string().nullable(),
  provider_event_id: z.string().nullable(),
  minute: z.number().int().nullable(),
  title: z.string().nullable(),
  distractors: z.array(TriviaSlotSchema),
});
export type JugadaChallenge = z.infer<typeof JugadaChallengeSchema>;

/** User answers: slotId → chosen optionId. */
export const TriviaAnswerSchema = z.record(z.string(), z.string());
export type TriviaAnswer = z.infer<typeof TriviaAnswerSchema>;

/** What submit-answer returns: grade, the correct option per slot, rewards. */
export const TriviaResultSchema = z.object({
  correctSlots: z.number().int(),
  totalSlots: z.number().int(),
  reveal: z.record(z.string(), z.string()),
  coinsAwarded: z.number().int(),
  packsAwarded: z.number().int(),
  alreadyDone: z.boolean(),
});
export type TriviaResult = z.infer<typeof TriviaResultSchema>;

export const TRIVIA_COINS_PER_SLOT = 25;
export const TRIVIA_PERFECT_PACKS = 2;
