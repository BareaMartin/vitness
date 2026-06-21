import type { PitchPoint, PlayScript } from "./play-script.ts";

/**
 * Completes a sparse PlayScript (the hand-authored demo goals and the live
 * compose-play templates only carry a handful of named dots) into a full 11-v-11
 * picture: each side gets a goalkeeper and enough outfield team-mates, arranged
 * in a formation that shifts with the ball and capped to a running speed so they
 * move as individuals. Plays that are already full (e.g. the StatsBomb retro
 * reconstructions) are returned untouched. Pure + deterministic.
 */

// Outfield formation slots, as {dx, y} offsets from a moving team anchor; dx is
// measured along the attacking direction. Taken in order to top each side up.
const AWAY_SLOTS = [
  { dx: 6, y: 14, yg: 0.12, cap: 9 }, { dx: 6, y: 31, yg: 0.12, cap: 9 }, { dx: 6, y: 49, yg: 0.12, cap: 9 }, { dx: 6, y: 66, yg: 0.12, cap: 9 },
  { dx: -13, y: 22, yg: 0.2, cap: 9.5 }, { dx: -13, y: 40, yg: 0.2, cap: 9.5 }, { dx: -13, y: 58, yg: 0.2, cap: 9.5 },
  { dx: -32, y: 28, yg: 0.24, cap: 10 }, { dx: -32, y: 40, yg: 0.24, cap: 10 }, { dx: -32, y: 52, yg: 0.24, cap: 10 },
];
const HOME_SLOTS = [
  { dx: 0, y: 20, yg: 0.15, cap: 11 }, { dx: 0, y: 60, yg: 0.15, cap: 11 },
  { dx: -12, y: 40, yg: 0.15, cap: 11 }, { dx: -14, y: 12, yg: 0.12, cap: 10 },
  { dx: -14, y: 68, yg: 0.12, cap: 10 }, { dx: 10, y: 30, yg: 0.18, cap: 11 },
  { dx: 10, y: 50, yg: 0.18, cap: 11 }, { dx: -26, y: 40, yg: 0.12, cap: 10 },
  { dx: -40, y: 26, yg: 0.1, cap: 10 }, { dx: -40, y: 54, yg: 0.1, cap: 10 },
];

export function densifyPlayScript(script: PlayScript): PlayScript {
  const homeActors = script.actors.filter((a) => a.team === "home");
  const awayActors = script.actors.filter((a) => a.team === "away");
  const homeHasGk = homeActors.some((a) => a.role === "keeper");
  const awayHasGk = awayActors.some((a) => a.role === "keeper");
  const needHomeOut = Math.max(0, 10 - (homeActors.length - (homeHasGk ? 1 : 0)));
  const needAwayOut = Math.max(0, 10 - (awayActors.length - (awayHasGk ? 1 : 0)));
  if (needHomeOut === 0 && needAwayOut === 0 && homeHasGk && awayHasGk) return script;

  const home = script.attackingSide === "home";
  const dir = home ? 1 : -1; // attacking direction along x
  const homeGoalX = home ? 5 : 115; // the scoring team's own goal
  const awayGoalX = home ? 115 : 5; // the goal under attack
  const dur = script.durationMs;
  const kf = script.keyframes;
  const clampX = (v: number) => Math.max(2, Math.min(118, v));
  const clampY = (v: number) => Math.max(3, Math.min(77, v));
  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
  const round = (v: number) => Math.round(v * 10) / 10;

  // A capped track for one added player, sampled per keyframe from a target fn.
  const track = (target: (b: PitchPoint) => PitchPoint, cap: number): PitchPoint[] => {
    const out: PitchPoint[] = [];
    for (let i = 0; i < kf.length; i++) {
      const tgt = target(kf[i]!.ball);
      if (i === 0) {
        out.push(tgt);
        continue;
      }
      const prev = out[i - 1]!;
      const dt = ((kf[i]!.t - kf[i - 1]!.t) * dur) / 1000;
      const maxStep = cap * dt;
      const dx = tgt.x - prev.x;
      const dy = tgt.y - prev.y;
      const d = Math.hypot(dx, dy);
      out.push(d <= maxStep || d === 0 ? tgt : { x: prev.x + (dx / d) * maxStep, y: prev.y + (dy / d) * maxStep });
    }
    return out.map((p) => ({ x: round(clampX(p.x)), y: round(clampY(p.y)) }));
  };

  const added: { slotId: string; team: "home" | "away"; role: "carrier" | "defender" | "keeper"; pos: PitchPoint[] }[] = [];

  // opposition block (defending the attacked goal)
  const awayAnchor = (b: PitchPoint) => clampX(b.x + dir * 4);
  AWAY_SLOTS.slice(0, needAwayOut).forEach((o, k) =>
    added.push({
      slotId: `fillA${k}`,
      team: "away",
      role: "defender",
      pos: track((b) => ({ x: awayAnchor(b) + dir * o.dx, y: o.y + (b.y - 40) * o.yg }), o.cap),
    }),
  );
  // scoring team's trailing team-mates
  const homeAnchor = (b: PitchPoint) => clampX(b.x - dir * 30);
  HOME_SLOTS.slice(0, needHomeOut).forEach((o, k) =>
    added.push({
      slotId: `fillH${k}`,
      team: "home",
      role: "carrier",
      pos: track((b) => ({ x: homeAnchor(b) + dir * o.dx, y: o.y + (b.y - 40) * o.yg }), o.cap),
    }),
  );
  // goalkeepers (one per side, if the play didn't already have them)
  if (!awayHasGk) {
    added.push({
      slotId: "fillGkA",
      team: "away",
      role: "keeper",
      pos: track((b) => ({ x: awayGoalX, y: lerp(40, b.y, 0.25) }), 7.5),
    });
  }
  if (!homeHasGk) {
    added.push({
      slotId: "fillGkH",
      team: "home",
      role: "keeper",
      pos: track((b) => ({ x: homeGoalX, y: lerp(40, b.y, 0.2) }), 6),
    });
  }

  const keyframes = kf.map((k, i) => {
    const extra: Record<string, PitchPoint> = {};
    for (const a of added) extra[a.slotId] = a.pos[i]!;
    return { ...k, actors: { ...k.actors, ...extra } };
  });

  return {
    ...script,
    actors: [...script.actors, ...added.map((a) => ({ slotId: a.slotId, team: a.team, role: a.role }))],
    keyframes,
  };
}
