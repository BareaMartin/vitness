import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WipNote } from "@/components/wip-note";
import { BottomTabInset, Brand, MaxContentWidth, Spacing, WebHeaderInset } from "@/constants/theme";
import { JugadaTrivia } from "@/components/jugada/jugada-trivia";
import { RETRO_JUGADAS, type RetroJugada } from "@/data/retro";

/**
 * Golazos — the trivia hall. Every famous goal we have real StatsBomb data for,
 * playable as a "who was in the play?" reconstruction. Each one you solve pays
 * out coins + packs, so this is how you earn more sobres after the starter
 * allotment. (Golazos are no longer collectible cards — the play IS the reward.)
 */
export default function GolazosScreen() {
  const [open, setOpen] = useState<RetroJugada | null>(null);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.heading}>
              Golazos
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {RETRO_JUGADAS.length} jugadas
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Reviví goles históricos, adiviná quién participó y ganá sobres por cada acierto.
          </ThemedText>

          {RETRO_JUGADAS.map((j) => (
            <Pressable
              key={j.providerEventId}
              onPress={() => setOpen(j)}
              style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <View style={styles.playBadge}>
                  <ThemedText type="default" style={styles.playIcon}>
                    ▶
                  </ThemedText>
                </View>
                <View style={styles.info}>
                  <ThemedText type="smallBold" style={styles.kicker}>
                    STATSBOMB · TRIVIA
                  </ThemedText>
                  <ThemedText type="default" style={styles.title} numberOfLines={2}>
                    {j.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    ¿Quién estuvo en la jugada? Acertá todo y ganá 5 sobres →
                  </ThemedText>
                </View>
              </ThemedView>
            </Pressable>
          ))}

          <WipNote title="Demo · datos reales pero limitados">
            Estas son jugadas reales de StatsBomb (Mundial 2022). En producción, los
            Golazos se poblarían con los goles reales del Mundial 2026 a medida que
            ocurren — no las representaciones fabricadas que ves en otras secciones.
          </WipNote>
        </ScrollView>
      </SafeAreaView>

      {open ? (
        <JugadaTrivia
          script={open.playScript}
          providerEventId={open.providerEventId}
          title={open.title}
          homeKit={open.home}
          awayKit={open.away}
          onClose={() => setOpen(null)}
          onAwarded={() => {}}
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
  pressed: { opacity: 0.7 },
  card: {
    flexDirection: "row",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginTop: Spacing.one,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239,159,39,0.5)",
  },
  playBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EF9F27",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: { color: "#1a1206", fontSize: 18, lineHeight: 20, marginLeft: 2 },
  info: { flex: 1, gap: Spacing.half },
  kicker: { color: "#EF9F27", fontSize: 11, letterSpacing: 0.5 },
  title: { color: "#ffffff", fontSize: 17, lineHeight: 22, fontWeight: "700" },
});
