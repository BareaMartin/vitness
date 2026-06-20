import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MatchList } from "@/components/match/match-list";
import { MatchRoom } from "@/components/match/match-room";
import { JugadaTrivia } from "@/components/jugada/jugada-trivia";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useSession } from "@/hooks/use-session";
import { retroJugadaOfTheDay } from "@/data/retro";

export default function HomeScreen() {
  const { ready, error } = useSession();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
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
        ) : selectedMatchId ? (
          <MatchRoom matchId={selectedMatchId} onBack={() => setSelectedMatchId(null)} />
        ) : (
          <View style={styles.list}>
            {retro ? (
              <Pressable onPress={() => setRetroOpen(true)}>
                <ThemedView type="backgroundElement" style={styles.retroCard}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Retro jugada · real StatsBomb data
                  </ThemedText>
                  <ThemedText type="default">▶ {retro.title}</ThemedText>
                </ThemedView>
              </Pressable>
            ) : null}
            <MatchList onSelect={setSelectedMatchId} />
          </View>
        )}
      </SafeAreaView>

      {retroOpen && retro ? (
        <JugadaTrivia
          script={retro.playScript}
          providerEventId={retro.providerEventId}
          title={retro.title}
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
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  list: { flex: 1, gap: Spacing.two },
  retroCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
    borderWidth: 2,
    borderColor: "#EF9F27",
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
