import type { MatchEvent } from "@vitness/shared";

/** A short, human-readable label for an event feed row. */
export function eventLabel(event: MatchEvent): { icon: string; text: string } {
  switch (event.type) {
    case "kickoff":
      return { icon: "○", text: "Kick-off" };
    case "goal":
      return { icon: "⚽", text: "Goal!" };
    case "card":
      return { icon: event.cardType === "red" ? "🟥" : "🟨", text: "Card" };
    case "substitution":
      return { icon: "↔", text: "Substitution" };
    case "shot":
      return { icon: "•", text: event.onTarget ? "Shot on target" : "Shot off target" };
    case "corner":
      return { icon: "⛳", text: "Corner" };
    case "half_time":
      return { icon: "⏸", text: "Half-time" };
    case "full_time":
      return { icon: "⏹", text: "Full-time" };
  }
}

/** Attacking-intent events used to weight the momentum bar. */
export function isAttackingEvent(event: MatchEvent): boolean {
  return event.type === "goal" || event.type === "shot" || event.type === "corner";
}
