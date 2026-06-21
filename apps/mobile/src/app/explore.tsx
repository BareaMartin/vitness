import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing, WebHeaderInset } from "@/constants/theme";
import { useCollection } from "@/hooks/use-collection";
import { StickerCard } from "@/components/sticker/sticker-card";
import { PackOpening } from "@/components/sticker/pack-opening";

/**
 * Álbum — the player collection screen. Shows the unopened-pack queue and the
 * match sticker album (owned cards vs locked slots) with completion. Golazos
 * live on their own tab. See ticket VIT-6.
 */
export default function AlbumScreen() {
  const { stickers, unopenedPackIds, loading, refresh } = useCollection();
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);

  // Golazos are collected on their own tab; the album is the player cards.
  const albumStickers = stickers.filter((s) => s.card.kind !== "golazo");
  const ownedCount = albumStickers.filter((s) => s.owned).length;
  const total = albumStickers.length;
  const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.heading}>
              Álbum
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {ownedCount}/{total} · {pct}%
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Argentina vs Mexico
          </ThemedText>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>

          {unopenedPackIds.length > 0 ? (
            <Pressable style={styles.packBtn} onPress={() => setOpeningPackId(unopenedPackIds[0]!)}>
              <ThemedText type="small" style={styles.packText}>
                🎁 Open pack · {unopenedPackIds.length} waiting
              </ThemedText>
            </Pressable>
          ) : (
            <ThemedView type="backgroundElement" style={styles.hint}>
              <ThemedText type="small" themeColor="textSecondary">
                No packs yet — win jugada trivia to earn them.
              </ThemedText>
            </ThemedView>
          )}

          {loading ? (
            <ThemedText type="small" themeColor="textSecondary">
              Loading album…
            </ThemedText>
          ) : (
            <View style={styles.grid}>
              {albumStickers.map((s) => (
                <StickerCard key={s.id} card={s.owned ? s.card : null} count={s.count} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {openingPackId ? (
        <PackOpening
          packId={openingPackId}
          onDone={() => {
            setOpeningPackId(null);
            refresh();
          }}
        />
      ) : null}
    </ThemedView>
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
  progressFill: { height: "100%", backgroundColor: "#1D9E75" },
  packBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#185FA5",
    borderRadius: 999,
    marginVertical: Spacing.one,
  },
  packText: { color: "#ffffff" },
  hint: { borderRadius: Spacing.two, padding: Spacing.three, marginVertical: Spacing.one },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "flex-start" },
});
