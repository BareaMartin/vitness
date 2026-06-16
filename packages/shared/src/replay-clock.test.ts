import { describe, it, expect, vi } from "vitest";
import { orderEvents, computeDelaysMs, replayEvents } from "./replay-clock.ts";
import type { MatchEvent } from "./match-event.ts";

function ev(minute: number, providerEventId: string): MatchEvent {
  return { type: "kickoff", minute, team: "home", providerEventId };
}

describe("orderEvents", () => {
  it("sorts by minute ascending", () => {
    const ordered = orderEvents([ev(45, "c"), ev(12, "a"), ev(34, "b")]);
    expect(ordered.map((e) => e.providerEventId)).toEqual(["a", "b", "c"]);
  });

  it("preserves original order within the same minute (stable)", () => {
    const ordered = orderEvents([ev(45, "first"), ev(45, "second"), ev(12, "early")]);
    expect(ordered.map((e) => e.providerEventId)).toEqual(["early", "first", "second"]);
  });
});

describe("computeDelaysMs", () => {
  it("first event fires immediately, gaps scale by speed", () => {
    const events = [ev(0, "a"), ev(12, "b"), ev(34, "c")];
    const delays = computeDelaysMs(events, 60);
    expect(delays).toEqual([0, 12000, 22000]);
  });

  it("doubling speed halves the gaps", () => {
    const events = [ev(0, "a"), ev(10, "b")];
    expect(computeDelaysMs(events, 120)).toEqual([0, 5000]);
  });

  it("throws on non-positive speed", () => {
    expect(() => computeDelaysMs([ev(0, "a")], 0)).toThrow(/speed must be > 0/);
    expect(() => computeDelaysMs([ev(0, "a")], -5)).toThrow(/speed must be > 0/);
  });
});

describe("replayEvents", () => {
  it("emits all events in minute order via injected sleep", async () => {
    const slept: number[] = [];
    const emitted: string[] = [];
    const sleep = (ms: number) => {
      slept.push(ms);
      return Promise.resolve();
    };
    await replayEvents(
      [ev(34, "c"), ev(0, "a"), ev(12, "b")],
      async (e) => {
        emitted.push(e.providerEventId);
      },
      { speed: 60, sleep },
    );
    expect(emitted).toEqual(["a", "b", "c"]);
    expect(slept).toEqual([12000, 22000]);
  });

  it("aborts when onEvent rejects", async () => {
    const emitted: string[] = [];
    const sleep = () => Promise.resolve();
    await expect(
      replayEvents(
        [ev(0, "a"), ev(5, "b")],
        async (e) => {
          emitted.push(e.providerEventId);
          if (e.providerEventId === "a") throw new Error("boom");
        },
        { speed: 60, sleep },
      ),
    ).rejects.toThrow("boom");
    expect(emitted).toEqual(["a"]);
  });
});
