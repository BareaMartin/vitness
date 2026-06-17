import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MatchList } from "@/components/match/match-list";
import { MatchRoom } from "@/components/match/match-room";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useSession } from "@/hooks/use-session";

export default function HomeScreen() {
  const { ready, error } = useSession();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

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
          <MatchList onSelect={setSelectedMatchId} />
        )}
      </SafeAreaView>
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
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
