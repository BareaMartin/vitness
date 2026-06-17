import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { Match } from "@vitness/shared";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
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
      <ThemedText type="subtitle" style={styles.heading}>
        Hoy
      </ThemedText>
      {loading ? (
        <ThemedText type="small" themeColor="textSecondary">
          Loading matches…
        </ThemedText>
      ) : matches.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary">
          No matches yet. Run `pnpm replay` to seed one.
        </ThemedText>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {matches.map((m) => (
            <Pressable key={m.id} onPress={() => onSelect(m.id)}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedText type="default">
                  {m.home_team} vs {m.away_team}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {m.status}
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.three },
  heading: { fontSize: 28, lineHeight: 34 },
  list: { gap: Spacing.two },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
