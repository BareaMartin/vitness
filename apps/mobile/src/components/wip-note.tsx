import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

/**
 * A "work in progress" disclosure banner. The contest build runs on placeholder
 * data (the 2026 fixtures are fabricated); these notes say plainly what's a demo
 * stand-in and what the production version would be populated with. Honesty over
 * the illusion of completeness.
 */
export function WipNote({ title, children }: { title: string; children: string }) {
  return (
    <View style={styles.note}>
      <ThemedText type="smallBold" style={styles.title}>
        🚧 {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.body}>
        {children}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
    backgroundColor: "rgba(239,159,39,0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(239,159,39,0.35)",
  },
  title: { color: "#EF9F27", fontSize: 12, letterSpacing: 0.3 },
  body: { fontSize: 13, lineHeight: 18 },
});
