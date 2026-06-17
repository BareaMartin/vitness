import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import type { MatchEvent } from "@vitness/shared";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { isAttackingEvent } from "./event-label";

const RECENT_WINDOW = 8;
const HOME_COLOR = "#378ADD";
const AWAY_COLOR = "#D85A30";

/**
 * A simple attack-momentum indicator: the share of recent attacking events
 * (goals, shots, corners) per side. Honest from event data — no fake tracking.
 */
export function MomentumBar({ events }: { events: readonly MatchEvent[] }) {
  const homeShare = useMemo(() => {
    const recent = events.filter(isAttackingEvent).slice(-RECENT_WINDOW);
    if (recent.length === 0) return 0.5;
    const home = recent.filter((e) => e.team === "home").length;
    return home / recent.length;
  }, [events]);

  const homePct = Math.round(homeShare * 100);

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <ThemedText type="small">{homePct}%</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          momentum
        </ThemedText>
        <ThemedText type="small">{100 - homePct}%</ThemedText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { flex: homeShare, backgroundColor: HOME_COLOR }]} />
        <View style={[styles.fill, { flex: 1 - homeShare, backgroundColor: AWAY_COLOR }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.one },
  labels: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  track: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" },
  fill: { height: "100%" },
});
