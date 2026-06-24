import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { JugadaTrivia } from "@/components/jugada/jugada-trivia";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WipNote } from "@/components/wip-note";
import { Brand, BottomTabInset, MaxContentWidth, Spacing, WebHeaderInset } from "@/constants/theme";
import { useSession } from "@/hooks/use-session";
import { retroJugadaOfTheDay } from "@/data/retro";

/**
 * Home — the showcase. The 2026 fixtures are fabricated, so the home leads with
 * the one piece of real, fully-produced content: the Jugada del Día, the 2022
 * World Cup final (Argentina vs France). Watch the reconstruction, prove you saw
 * it, earn the pack. Albums + golazos live on their own tabs.
 */
export default function HomeScreen() {
  const { ready, error } = useSession();
  const [retroOpen, setRetroOpen] = useState(false);
  const retro = retroJugadaOfTheDay();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {error ? (
          <View style={styles.centered}>
            <ThemedText type="small" themeColor="textSecondary">
              {error}
            </ThemedText>
          </View>
        ) : !ready ? (
          <View style={styles.centered}>
            <ThemedText type="small" themeColor="textSecondary">
              Connecting…
            </ThemedText>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <ThemedText type="smallBold" style={styles.kicker}>
                LA FINAL DEL MUNDIAL · 2022
              </ThemedText>
              <ThemedText type="title" style={styles.heroTitle}>
                🇦🇷 Argentina vs Francia 🇫🇷
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.heroSub}>
                Reviví la jugada del día, demostrá que la viste y ganá tu primer sobre.
              </ThemedText>
            </View>

            {retro ? (
              <Pressable
                onPress={() => setRetroOpen(true)}
                style={({ pressed }) => pressed && styles.pressed}>
                <ThemedView type="backgroundElement" style={styles.retroCard}>
                  <View style={styles.retroPlayBadge}>
                    <ThemedText type="default" style={styles.retroPlayIcon}>
                      ▶
                    </ThemedText>
                  </View>
                  <View style={styles.retroBody}>
                    <ThemedText type="smallBold" style={styles.retroKicker}>
                      JUGADA DEL DÍA · STATSBOMB
                    </ThemedText>
                    <ThemedText type="default" style={styles.retroTitle} numberOfLines={2}>
                      {retro.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      ¿Quién estuvo en la jugada? Acertá y ganá monedas →
                    </ThemedText>
                  </View>
                </ThemedView>
              </Pressable>
            ) : null}

            <ThemedView type="backgroundElement" style={styles.hint}>
              <ThemedText type="small" themeColor="textSecondary">
                Jugá más trivias en la pestaña <ThemedText type="smallBold">Golazos</ThemedText> para ganar
                sobres · armá tu colección en <ThemedText type="smallBold">Álbum</ThemedText>.
              </ThemedText>
            </ThemedView>

            <WipNote title="Demo del Mundial 2026">
              El fixture y los goles del Mundial 2026 todavía no existen, así que esta demo
              corre sobre datos reales del 2022. En producción se poblaría con el fixture
              real del 2026 y los goles a medida que se juegan — no representaciones fabricadas.
            </WipNote>
          </ScrollView>
        )}
      </SafeAreaView>

      {retroOpen && retro ? (
        <JugadaTrivia
          script={retro.playScript}
          providerEventId={retro.providerEventId}
          title={retro.title}
          homeKit={retro.home}
          awayKit={retro.away}
          onClose={() => setRetroOpen(false)}
          onAwarded={() => {}}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center" },
  safeArea: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three + WebHeaderInset,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  list: { gap: Spacing.three },
  pressed: { opacity: 0.7 },
  hero: { gap: Spacing.one, paddingTop: Spacing.two },
  kicker: { color: Brand.accent, fontSize: 12, letterSpacing: 1 },
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: "900" },
  heroSub: { fontSize: 15, lineHeight: 21 },
  retroCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: "rgba(239,159,39,0.5)",
  },
  retroPlayBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EF9F27",
    alignItems: "center",
    justifyContent: "center",
  },
  retroPlayIcon: { color: "#1a1206", fontSize: 18, lineHeight: 20, marginLeft: 2 },
  retroBody: { flex: 1, gap: Spacing.half },
  retroKicker: { color: "#EF9F27", fontSize: 11, letterSpacing: 0.5 },
  retroTitle: { fontSize: 17, lineHeight: 22, fontWeight: "700" },
  hint: { borderRadius: Spacing.two, padding: Spacing.three },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
