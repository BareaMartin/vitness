import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { StickerCard as Card } from "@vitness/shared";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, BottomTabInset, MaxContentWidth, Spacing, WebHeaderInset } from "@/constants/theme";
import { useMegaAlbum } from "@/hooks/use-mega-album";
import { useTeamSquad } from "@/hooks/use-team-squad";
import { StickerCard } from "@/components/sticker/sticker-card";

/**
 * Mundial '26 — the tournament-wide mega-album: 48 team badges across the 12
 * groups, owned vs locked. Tap a nation to open its squad page (player cards
 * owned vs locked). Badges drop from any pack. See tickets VIT-10 / VIT-12.
 */
export default function MundialScreen() {
  const { groups, ownedCount, total, loading } = useMegaAlbum();
  const [team, setTeam] = useState<{ card: Card; owned: boolean } | null>(null);
  const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.heading}>
              Mundial &apos;26
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {ownedCount}/{total} teams · {pct}%
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Tap a nation for its squad — badges drop from any pack.
          </ThemedText>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>

          {loading ? (
            <ThemedText type="small" themeColor="textSecondary">
              Loading the tournament…
            </ThemedText>
          ) : (
            groups.map((g) => (
              <View key={g.group} style={styles.group}>
                <ThemedText type="smallBold" style={styles.groupTitle}>
                  {g.group}
                </ThemedText>
                <View style={styles.grid}>
                  {g.teams.map((t) => (
                    <Pressable key={t.id} onPress={() => setTeam({ card: t.card, owned: t.owned })}>
                      <StickerCard card={t.owned ? t.card : null} />
                    </Pressable>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>

      {team ? <TeamPage badge={team.card} badgeOwned={team.owned} onClose={() => setTeam(null)} /> : null}
    </ThemedView>
  );
}

function TeamPage({ badge, badgeOwned, onClose }: { badge: Card; badgeOwned: boolean; onClose: () => void }) {
  const { players, ownedCount, total, loading } = useTeamSquad(badge.team.code);
  const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;

  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <ThemedText type="default" style={styles.teamTitle}>
            {badge.team.flagEmoji} {badge.team.name}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={Spacing.two}>
            <ThemedText type="link">Close</ThemedText>
          </Pressable>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {badge.group} · {badgeOwned ? "badge owned" : "badge locked"}
          {total > 0 ? ` · squad ${ownedCount}/${total}` : ""}
        </ThemedText>

        {loading ? (
          <ThemedText type="small" themeColor="textSecondary">
            Loading squad…
          </ThemedText>
        ) : total === 0 ? (
          <ThemedView type="backgroundElement" style={styles.soon}>
            <ThemedText type="small" themeColor="textSecondary">
              Squad cards coming soon for {badge.team.name}.
            </ThemedText>
          </ThemedView>
        ) : (
          <ScrollView contentContainerStyle={styles.squadGrid}>
            {players.map((p) => (
              <StickerCard key={p.id} card={p.owned ? p.card : null} count={p.count} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, width: "100%", maxWidth: MaxContentWidth, alignSelf: "center" },
  content: {
    padding: Spacing.three,
    paddingTop: Spacing.four + WebHeaderInset,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heading: { fontSize: 28, lineHeight: 34 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#212225",
    overflow: "hidden",
    marginVertical: Spacing.one,
  },
  progressFill: { height: "100%", backgroundColor: Brand.accent },
  group: { gap: Spacing.one, marginTop: Spacing.two },
  groupTitle: { color: "#9aa0a6" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.three,
  },
  sheet: {
    width: "100%",
    maxWidth: MaxContentWidth,
    maxHeight: "85%",
    backgroundColor: "#111316",
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  teamTitle: { color: "#ffffff" },
  soon: { borderRadius: Spacing.two, padding: Spacing.four, alignItems: "center" },
  squadGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "flex-start" },
});
