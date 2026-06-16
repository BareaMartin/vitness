import type { MatchEvent } from "./match-event.ts";

/**
 * Pure timeline logic for replaying a recorded match. Given events and a speed
 * multiplier, it computes the real-time delay before each event and drives an
 * emit callback. Side-effect-free at module scope (no timers/fetch/Deno) so it
 * unit-tests in any runtime via the injected `sleep` seam.
 *
 * `speed` is match-minutes per real-second: speed=60 means one match-minute
 * elapses in one real second, so a 90' match replays in ~90s.
 */

export interface ReplayClockOptions {
  /** Match-minutes elapsed per real-time second. Must be > 0. */
  speed: number;
  /** Injected delay (ms). Defaults to a real timer; override in tests. */
  sleep?: (ms: number) => Promise<void>;
}

const realSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    const scheduler = globalThis as unknown as {
      setTimeout: (callback: () => void, ms: number) => unknown;
    };
    scheduler.setTimeout(() => resolve(), ms);
  });

/** Sort events by minute ascending, preserving original order within a minute. */
export function orderEvents(events: readonly MatchEvent[]): MatchEvent[] {
  return events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => a.event.minute - b.event.minute || a.index - b.index)
    .map(({ event }) => event);
}

/**
 * The real-time gap (ms) before each ordered event, scaled by `speed`. The
 * first event fires immediately (0). Each subsequent gap is the minute delta
 * to the previous event converted to milliseconds.
 */
export function computeDelaysMs(
  events: readonly MatchEvent[],
  speed: number,
): number[] {
  if (speed <= 0) throw new Error(`replay speed must be > 0, got ${speed}`);
  const msPerMinute = 60000 / speed;
  const ordered = orderEvents(events);
  return ordered.map((event, i) => {
    if (i === 0) return 0;
    const prev = ordered[i - 1];
    if (prev === undefined) return 0;
    return Math.max(0, (event.minute - prev.minute) * msPerMinute);
  });
}

/**
 * Replay `events` on the timeline, awaiting `onEvent` for each. Events are
 * ordered by minute first; `onEvent` rejection aborts the replay.
 */
export async function replayEvents(
  events: readonly MatchEvent[],
  onEvent: (event: MatchEvent) => Promise<void>,
  options: ReplayClockOptions,
): Promise<void> {
  const sleep = options.sleep ?? realSleep;
  const ordered = orderEvents(events);
  const delays = computeDelaysMs(ordered, options.speed);
  for (let i = 0; i < ordered.length; i++) {
    const delay = delays[i] ?? 0;
    if (delay > 0) await sleep(delay);
    const event = ordered[i];
    if (event !== undefined) await onEvent(event);
  }
}
