import type { PitchPoint, PlayScript } from "./play-script.ts";

/**
 * Completes a sparse PlayScript (the hand-authored demo goals and the live
 * compose-play templates only carry a handful of named dots) into a full 11-v-11
 * picture: each side gets a goalkeeper and enough outfield team-mates, arranged
 * in a formation that shifts with the ball and capped to a running speed so they
 * move as individuals. Plays that are already full (e.g. the StatsBomb retro
 * reconstructions) are returned untouched. Pure + deterministic.
 */

// Formation players are NOT in the move — they hold a fixed spot while the ball
// and the on-ball actors do the work. `rest` is yards in front of their own goal
// (away defends the attacked goal; home sits up from its own); `ry` is the lane.
interface SlotCfg {
  rest: number;
  ry: number;
}
// Opposition shape (defends the attacked goal): a still back four / midfield
// three / front three the ball threads through.
const AWAY_SLOTS: SlotCfg[] = [
  { rest: 6, ry: 14 }, { rest: 4, ry: 30 }, { rest: 7, ry: 50 }, { rest: 5, ry: 66 },
  { rest: 22, ry: 22 }, { rest: 25, ry: 40 }, { rest: 20, ry: 58 },
  { rest: 37, ry: 28 }, { rest: 40, ry: 40 }, { rest: 35, ry: 52 },
];
// Scoring team's team-mates: hold their shape behind the move.
const HOME_SLOTS: SlotCfg[] = [
  { rest: 55, ry: 18 }, { rest: 51, ry: 62 }, { rest: 43, ry: 40 }, { rest: 35, ry: 12 },
  { rest: 35, ry: 68 }, { rest: 61, ry: 30 }, { rest: 61, ry: 50 }, { rest: 29, ry: 40 },
  { rest: 26, ry: 26 }, { rest: 26, ry: 54 },
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
  const track = (target: (b: PitchPoint, i: number) => PitchPoint, cap: number): PitchPoint[] => {
    const out: PitchPoint[] = [];
    for (let i = 0; i < kf.length; i++) {
      const tgt = target(kf[i]!.ball, i);
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

  // A player who holds one spot for the whole play (not involved in the move).
  const stat = (x: number, y: number): PitchPoint[] => {
    const p = { x: round(clampX(x)), y: round(clampY(y)) };
    return kf.map(() => p);
  };

  // opposition block (defending the attacked goal): a still shape, `rest` yd in
  // front of that goal, that the ball threads through.
  AWAY_SLOTS.slice(0, needAwayOut).forEach((o, k) =>
    added.push({ slotId: `fillA${k}`, team: "away", role: "defender", pos: stat(awayGoalX - dir * o.rest, o.ry) }),
  );
  // scoring team's trailing team-mates: still, holding shape behind the move.
  HOME_SLOTS.slice(0, needHomeOut).forEach((o, k) =>
    added.push({ slotId: `fillH${k}`, team: "home", role: "carrier", pos: stat(homeGoalX + dir * o.rest, o.ry) }),
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
    // the far keeper isn't part of the move — hold the goal line.
    added.push({ slotId: "fillGkH", team: "home", role: "keeper", pos: stat(homeGoalX, 40) });
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
