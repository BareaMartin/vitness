import { describe, it, expect } from "vitest";
import { matchEventSchema, recordedMatchSchema } from "./match-event.ts";

describe("matchEventSchema", () => {
  it("accepts a goal with scorer and optional assist", () => {
    expect(() =>
      matchEventSchema.parse({
        type: "goal",
        minute: 76,
        team: "home",
        providerEventId: "g1",
        scorerId: "p10",
        assistId: "p11",
      }),
    ).not.toThrow();
  });

  it("accepts a goal without assist", () => {
    expect(() =>
      matchEventSchema.parse({
        type: "goal",
        minute: 30,
        team: "away",
        providerEventId: "g2",
        scorerId: "p20",
      }),
    ).not.toThrow();
  });

  it("rejects a goal missing scorerId", () => {
    expect(() =>
      matchEventSchema.parse({
        type: "goal",
        minute: 30,
        team: "home",
        providerEventId: "g3",
      }),
    ).toThrow();
  });

  it("rejects an unknown event type", () => {
    expect(() =>
      matchEventSchema.parse({
        type: "telepathy",
        minute: 10,
        team: "home",
        providerEventId: "x1",
      }),
    ).toThrow();
  });

  it("rejects a missing minute", () => {
    expect(() =>
      matchEventSchema.parse({ type: "kickoff", team: "home", providerEventId: "k1" }),
    ).toThrow();
  });

  it("rejects a minute out of range (extra time cap 130)", () => {
    expect(() =>
      matchEventSchema.parse({
        type: "full_time",
        minute: 131,
        team: "home",
        providerEventId: "f1",
      }),
    ).toThrow();
  });

  it("validates card and substitution payloads", () => {
    expect(() =>
      matchEventSchema.parse({
        type: "card",
        minute: 22,
        team: "away",
        providerEventId: "c1",
        playerId: "p7",
        cardType: "yellow",
      }),
    ).not.toThrow();
    expect(() =>
      matchEventSchema.parse({
        type: "substitution",
        minute: 60,
        team: "home",
        providerEventId: "s1",
        playerOutId: "p9",
        playerInId: "p14",
      }),
    ).not.toThrow();
  });
});

describe("recordedMatchSchema", () => {
  it("requires match, lineups, and at least one event", () => {
    expect(() => recordedMatchSchema.parse({ match: {}, lineups: {}, events: [] })).toThrow();
  });
});
