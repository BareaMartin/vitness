import { z } from "zod";

/** Domain enums shared between the mobile app and the edge functions. */

export const StickerRaritySchema = z.enum(["common", "rare", "golazo"]);
export type StickerRarity = z.infer<typeof StickerRaritySchema>;

export const PackStateSchema = z.enum(["unopened", "opened_unviewed", "viewed"]);
export type PackState = z.infer<typeof PackStateSchema>;

export const JugadaSourceSchema = z.enum(["live", "retro"]);
export type JugadaSource = z.infer<typeof JugadaSourceSchema>;

/** Reward economy constants — mirror docs/CONCEPT.md "Economy". Server is the
 * source of truth; these exist so the client can show expected values. */
export const ECONOMY = {
  microPredictionHit: 50,
  triviaPerCorrectSlot: 25,
  liveTriviaPerfectPacks: 2,
  retroSetPerfectPacks: 3,
  beatAllPunditsPacks: 1,
  albumCompleteBonusPacks: 1,
  dailyLogin: 50,
  packPrice: 100,
  lateWindowMultiplier: 0.5,
} as const;

/** Drop-table odds and pity thresholds — mirror the open_pack SQL function. */
export const DROP_TABLE = {
  golazoChance: 0.05,
  rareChance: 0.3,
  pityRareEvery: 10,
  pityGolazoEvery: 30,
  packSize: 3,
} as const;

/** The three La Mesa pundit personas. */
export const PERSONAS = ["el_relator", "la_analista", "el_agitador"] as const;
export const PersonaSchema = z.enum(PERSONAS);
export type Persona = z.infer<typeof PersonaSchema>;
