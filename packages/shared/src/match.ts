import { z } from "zod";

/**
 * Match domain model — mirrors the `matches` table in
 * supabase/migrations/20260615000000_initial_schema.sql. Shared so the mobile
 * app, edge functions, and the replay runner all agree on the shape.
 */

export const MatchStatusSchema = z.enum([
  "scheduled",
  "live",
  "halftime",
  "finished",
  "abandoned",
]);
export type MatchStatus = z.infer<typeof MatchStatusSchema>;

export const matchSchema = z.object({
  id: z.string(),
  providerMatchId: z.string().optional(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  kickoffAt: z.string(),
  status: MatchStatusSchema,
});
export type Match = z.infer<typeof matchSchema>;

export const TeamSideSchema = z.enum(["home", "away"]);
export type TeamSide = z.infer<typeof TeamSideSchema>;

/** A player as it appears in a match lineup. `id` is the provider's player id. */
export const lineupPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  shirtNumber: z.number().int().min(1).max(99),
  position: z.string(),
});
export type LineupPlayer = z.infer<typeof lineupPlayerSchema>;

export const lineupSchema = z.object({
  formation: z.string().optional(),
  players: z.array(lineupPlayerSchema).min(1),
});
export type Lineup = z.infer<typeof lineupSchema>;

export const matchLineupsSchema = z.object({
  home: lineupSchema,
  away: lineupSchema,
});
export type MatchLineups = z.infer<typeof matchLineupsSchema>;
