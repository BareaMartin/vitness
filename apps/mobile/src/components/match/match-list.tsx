import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { Match } from "@vitness/shared";

import { ThemedText } from "@/components/themed-text";
import { Brand, Spacing } from "@/constants/theme";
import { teamFlag } from "@/data/team-flags";
import { supabase } from "@/lib/supabase";

interface MatchRow {
  id: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  status: Match["status"];
}

export function MatchList({ onSelect }: { onSelect: (matchId: string) => void }) {
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("matches")
        .select("id, home_team, away_team, kickoff_at, status")
        .order("kickoff_at", { ascending: true });
      if (active) {
        setMatches((data as MatchRow[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="subtitle" style={styles.heading}>
          Partidos
        </ThemedText>
        {!loading && matches.length > 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            {matches.length} · Mundial &apos;26
          </ThemedText>
        ) : null}
      </View>
      {loading ? (
        <ThemedText type="small" themeColor="textSecondary">
          Loading matches…
        </ThemedText>
      ) : matches.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          No matches yet. Run `pnpm replay` to seed one.
        </ThemedText>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} onPress={() => onSelect(m.id)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function MatchCard({ match, onPress }: { match: MatchRow; onPress: () => void }) {
  const home = teamFlag(match.home_team);
  const away = teamFlag(match.away_team);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.accentStripe, { backgroundColor: home.color }]} />
      <View style={styles.team}>
        <ThemedText type="default" style={styles.flag}>
          {home.flag}
        </ThemedText>
        <ThemedText type="default" numberOfLines={1} style={styles.teamName}>
          {match.home_team}
        </ThemedText>
      </View>

      <StatusPill status={match.status} kickoff={match.kickoff_at} />

      <View style={[styles.team, styles.teamRight]}>
        <ThemedText type="default" numberOfLines={1} style={[styles.teamName, styles.teamNameRight]}>
          {match.away_team}
        </ThemedText>
        <ThemedText type="default" style={styles.flag}>
          {away.flag}
        </ThemedText>
      </View>
    </Pressable>
  );
}

function StatusPill({ status, kickoff }: { status: MatchRow["status"]; kickoff: string }) {
  if (status === "live") {
    return (
      <View style={[styles.pill, styles.pillLive]}>
        <View style={styles.liveDot} />
        <ThemedText type="small" style={styles.pillLiveText}>
          EN VIVO
        </ThemedText>
      </View>
    );
  }
  if (status === "finished") {
    return (
      <View style={styles.pill}>
        <ThemedText type="small" themeColor="textSecondary">
          Final
        </ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.pill}>
      <ThemedText type="small" themeColor="textSecondary">
        {formatKickoff(kickoff)}
      </ThemedText>
    </View>
  );
}

function formatKickoff(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.three },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heading: { fontSize: 28, lineHeight: 34 },
  list: { gap: Spacing.two, paddingBottom: Spacing.three },
  card: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Brand.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  accentStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  pressed: { opacity: 0.65 },
  team: { flex: 1, flexDirection: "row", alignItems: "center", gap: Spacing.two, minWidth: 0 },
  teamRight: { justifyContent: "flex-end" },
  flag: { fontSize: 22, lineHeight: 26 },
  teamName: { flexShrink: 1, fontWeight: "600" },
  teamNameRight: { textAlign: "right" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pillLive: { backgroundColor: "rgba(22,196,127,0.16)" },
  pillLiveText: { color: Brand.accent, fontWeight: "700" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Brand.accent },
});
