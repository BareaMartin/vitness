import { ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, BottomTabInset, MaxContentWidth, Spacing, WebHeaderInset } from "@/constants/theme";
import { teamFlag } from "@/data/team-flags";
import { useMatchAlbum, type SideAlbum } from "@/hooks/use-match-album";
import { StickerCard } from "@/components/sticker/sticker-card";

/**
 * The album for a match — both nations' squads side by side, owned vs locked,
 * with a shortcut to watch the match reconstruction. Matches don't own stickers;
 * this just composes the two countries' albums. See deploy polish.
 */
export function MatchAlbum({
  homeTeam,
  awayTeam,
  onBack,
  onWatch,
}: {
  homeTeam: string;
  awayTeam: string;
  onBack: () => void;
  onWatch: () => void;
}) {
  const home = teamFlag(homeTeam);
  const away = teamFlag(awayTeam);
  const { home: homeAlbum, away: awayAlbum, loading } = useMatchAlbum(home.code, away.code);

  const owned = (homeAlbum?.ownedCount ?? 0) + (awayAlbum?.ownedCount ?? 0);
  const total = (homeAlbum?.total ?? 0) + (awayAlbum?.total ?? 0);
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={onBack} hitSlop={Spacing.two} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="link">‹ Partidos</ThemedText>
          </Pressable>

          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.heading} numberOfLines={1}>
              {home.flag} {homeTeam} vs {awayTeam} {away.flag}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Álbum del partido · {owned}/{total} · {pct}%
          </ThemedText>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>

          <Pressable style={styles.watchBtn} onPress={onWatch}>
            <ThemedText type="small" style={styles.watchText}>
              ▶ Ver la jugada
            </ThemedText>
          </Pressable>

          {loading ? (
            <ThemedText type="small" themeColor="textSecondary">
              Cargando álbum…
            </ThemedText>
          ) : (
            <>
              <Side title={homeTeam} flag={home.flag} album={homeAlbum} />
              <Side title={awayTeam} flag={away.flag} album={awayAlbum} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Side({ title, flag, album }: { title: string; flag: string; album: SideAlbum | null }) {
  const pct = album && album.total > 0 ? Math.round((album.ownedCount / album.total) * 100) : 0;
  return (
    <View style={styles.side}>
      <View style={styles.sideHeader}>
        <ThemedText type="smallBold" style={styles.sideTitle}>
          {flag} {title}
        </ThemedText>
        {album ? (
          <ThemedText type="small" themeColor="textSecondary">
            {album.ownedCount}/{album.total} · {pct}%
          </ThemedText>
        ) : null}
      </View>
      {!album ? (
        <ThemedView type="backgroundElement" style={styles.soon}>
          <ThemedText type="small" themeColor="textSecondary">
            Las figuritas de {title} llegan pronto.
          </ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.grid}>
          {album.players.map((p) => (
            <StickerCard key={p.id} card={p.owned ? p.card : null} count={p.count} />
          ))}
        </View>
      )}
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
  pressed: { opacity: 0.7 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heading: { fontSize: 24, lineHeight: 30 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#212225",
    overflow: "hidden",
    marginVertical: Spacing.one,
  },
  progressFill: { height: "100%", backgroundColor: Brand.accent },
  watchBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#185FA5",
    borderRadius: 999,
    marginVertical: Spacing.one,
  },
  watchText: { color: "#ffffff" },
  side: { gap: Spacing.one, marginTop: Spacing.two },
  sideHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sideTitle: { color: "#ffffff", fontSize: 15 },
  soon: { borderRadius: Spacing.two, padding: Spacing.three },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "flex-start" },
});
