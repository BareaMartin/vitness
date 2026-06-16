import { z } from "zod";
import { TeamSideSchema, matchSchema, matchLineupsSchema } from "./match.ts";

/**
 * Match events — the live-shaped event stream that drives the match room, the
 * jugada reconstruction, and (later) trivia. A discriminated union on `type`
 * keeps each event's payload precise. Provider-agnostic: API-Football, static
 * fixtures, and the replay engine all normalize into this shape.
 *
 * `minute` covers extra time (0–130). `providerEventId` is the dedup key that
 * makes replay idempotent and guards the future live poller against double
 * inserts.
 */

export const CardTypeSchema = z.enum(["yellow", "red", "second_yellow"]);
export type CardType = z.infer<typeof CardTypeSchema>;

const baseEventFields = {
  minute: z.number().int().min(0).max(130),
  team: TeamSideSchema,
  providerEventId: z.string(),
};

export const kickoffEventSchema = z.object({
  type: z.literal("kickoff"),
  ...baseEventFields,
});

export const goalEventSchema = z.object({
  type: z.literal("goal"),
  ...baseEventFields,
  scorerId: z.string(),
  assistId: z.string().optional(),
});

export const cardEventSchema = z.object({
  type: z.literal("card"),
  ...baseEventFields,
  playerId: z.string(),
  cardType: CardTypeSchema,
});

export const substitutionEventSchema = z.object({
  type: z.literal("substitution"),
  ...baseEventFields,
  playerOutId: z.string(),
  playerInId: z.string(),
});

export const shotEventSchema = z.object({
  type: z.literal("shot"),
  ...baseEventFields,
  playerId: z.string(),
  onTarget: z.boolean(),
});

export const cornerEventSchema = z.object({
  type: z.literal("corner"),
  ...baseEventFields,
});

export const halfTimeEventSchema = z.object({
  type: z.literal("half_time"),
  ...baseEventFields,
});

export const fullTimeEventSchema = z.object({
  type: z.literal("full_time"),
  ...baseEventFields,
});

export const matchEventSchema = z.discriminatedUnion("type", [
  kickoffEventSchema,
  goalEventSchema,
  cardEventSchema,
  substitutionEventSchema,
  shotEventSchema,
  cornerEventSchema,
  halfTimeEventSchema,
  fullTimeEventSchema,
]);
export type MatchEvent = z.infer<typeof matchEventSchema>;
export type GoalEvent = z.infer<typeof goalEventSchema>;

/**
 * A complete recorded match for replay: the match, both lineups, and the
 * ordered event stream. This is the fixture file shape consumed by the replay
 * runner.
 */
export const recordedMatchSchema = z.object({
  match: matchSchema,
  lineups: matchLineupsSchema,
  events: z.array(matchEventSchema).min(1),
});
export type RecordedMatch = z.infer<typeof recordedMatchSchema>;

export const matchEventTypes = [
  "kickoff",
  "goal",
  "card",
  "substitution",
  "shot",
  "corner",
  "half_time",
  "full_time",
] as const;
