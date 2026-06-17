import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { Match, MatchEvent } from "@vitness/shared";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useMatchRoom } from "@/hooks/use-match-room";
import { eventLabel } from "./event-label";
import { MomentumBar } from "./momentum-bar";

const STATUS_LABEL: Record<Match["status"], string> = {
  scheduled: "Kickoff soon",
  live: "LIVE",
  halftime: "Half-time",
  finished: "Full-time",
  abandoned: "Abandoned",
};

const STATUS_COLOR: Record<Match["status"], string> = {
  scheduled: "#60646C",
  live: "#D85A30",
  halftime: "#BA7517",
  finished: "#0F6E56",
  abandoned: "#60646C",
};

function teamName(match: Match, side: "home" | "away"): string {
  return side === "home" ? match.homeTeam : match.awayTeam;
}

function EventRow({ match, event }: { match: Match; event: MatchEvent }) {
  const { icon, text } = eventLabel(event);
  const side = teamName(match, event.team);
  return (
    <View style={styles.eventRow}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.eventMinute}>
        {event.minute}&apos;
      </ThemedText>
      <ThemedText type="default" style={styles.eventIcon}>
        {icon}
      </ThemedText>
      <ThemedText type="small">
        {text} · {side}
      </ThemedText>
    </View>
  );
}

export function MatchRoom({ matchId, onBack }: { matchId: string; onBack: () => void }) {
  const theme = useTheme();
  const { match, events, score, minute, loading, error } = useMatchRoom(matchId);

  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText type="small" themeColor="textSecondary">
          {error}
        </ThemedText>
      </View>
    );
  }

  if (loading && !match) {
    return (
      <View style={styles.centered}>
        <ThemedText type="small" themeColor="textSecondary">
          Loading match…
        </ThemedText>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.centered}>
        <ThemedText type="small" themeColor="textSecondary">
          Match not found.
        </ThemedText>
      </View>
    );
  }

  const feed = [...events].reverse();

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} hitSlop={Spacing.two}>
        <ThemedText type="link" themeColor="textSecondary">
          ‹ Matches
        </ThemedText>
      </Pressable>

      <ThemedView type="backgroundElement" style={styles.scoreCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[match.status] }]}>
            <ThemedText type="small" style={styles.statusText}>
              {STATUS_LABEL[match.status]}
            </ThemedText>
          </View>
          {match.status === "live" ? (
            <ThemedText type="small" themeColor="textSecondary">
              {minute}&apos;
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.scoreRow}>
          <ThemedText type="subtitle" style={styles.team}>
            {match.homeTeam}
          </ThemedText>
          <ThemedText type="title" style={styles.score}>
            {score.home}–{score.away}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.team}>
            {match.awayTeam}
          </ThemedText>
        </View>

        <MomentumBar events={events} />
      </ThemedView>

      {feed.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText type="small" themeColor="textSecondary">
            Kickoff soon — no events yet.
          </ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
          {feed.map((event, i) => (
            <View
              key={`${event.providerEventId}-${i}`}
              style={[styles.eventWrap, { borderBottomColor: theme.backgroundElement }]}>
              <EventRow match={match} event={event} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.three, paddingTop: Spacing.two },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.four },
  scoreCard: { borderRadius: Spacing.three, padding: Spacing.three, gap: Spacing.three },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusPill: { paddingHorizontal: Spacing.two, paddingVertical: Spacing.half, borderRadius: 999 },
  statusText: { color: "#ffffff" },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  team: { flex: 1, fontSize: 20, lineHeight: 26 },
  score: { fontSize: 36, lineHeight: 40, paddingHorizontal: Spacing.three },
  feed: { flex: 1 },
  feedContent: { gap: Spacing.half },
  eventWrap: { borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: Spacing.two },
  eventRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  eventMinute: { width: 28 },
  eventIcon: { width: 22, textAlign: "center" },
});
