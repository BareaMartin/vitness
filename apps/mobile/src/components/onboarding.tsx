import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Brand, MaxContentWidth, Spacing } from "@/constants/theme";

/** One step in the "how it works" flow. */
const STEPS: { icon: string; title: string; body: string }[] = [
  {
    icon: "👁",
    title: "Mirá",
    body: "Cada jugada clave del partido, redibujada como una reconstrucción en 2D.",
  },
  {
    icon: "✓",
    title: "Demostrá",
    body: "Adiviná quién participó en la jugada. Cada acierto te da monedas.",
  },
  {
    icon: "🎴",
    title: "Coleccioná",
    body: "Llenás un álbum de figuritas que no compraste — lo ganaste mirando.",
  },
];

/**
 * First-launch intro: the VITNESS pitch in three beats (watch → prove → earn).
 * A full-screen overlay shown above the tabs until the user taps Empezar; the
 * seen-flag is persisted by useOnboarding. See deploy polish.
 */
export function Onboarding({ onDone }: { onDone: () => void }) {
  return (
    <View style={styles.backdrop}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.inner}>
          <View style={styles.brand}>
            <View style={styles.brandDot}>
              <Text style={styles.brandDotText}>V</Text>
            </View>
            <Text style={styles.brandText}>
              VIT<Text style={styles.brandAccent}>NESS</Text>
            </Text>
          </View>

          <View style={styles.hero}>
            <ThemedText type="title" style={styles.heroTitle}>
              ¿Viste el partido?
            </ThemedText>
            <ThemedText type="default" style={styles.heroSub}>
              La segunda pantalla del Mundial 2026. Demostralo y armá tu álbum.
            </ThemedText>
          </View>

          <View style={styles.steps}>
            {STEPS.map((s) => (
              <View key={s.title} style={styles.step}>
                <View style={styles.stepIcon}>
                  <Text style={styles.stepIconText}>{s.icon}</Text>
                </View>
                <View style={styles.stepBody}>
                  <ThemedText type="smallBold" style={styles.stepTitle}>
                    {s.title}
                  </ThemedText>
                  <ThemedText type="small" style={styles.stepText}>
                    {s.body}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={onDone}
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
            <Text style={styles.ctaText}>Empezar ▸</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Brand.ink,
    zIndex: 100,
  },
  safe: { flex: 1, alignItems: "center" },
  inner: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth - 240,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    justifyContent: "center",
    gap: Spacing.five,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  brandDot: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: Brand.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  brandDotText: { color: Brand.accentInk, fontWeight: "900", fontSize: 17 },
  brandText: { color: "#ffffff", fontWeight: "800", fontSize: 20, letterSpacing: 1 },
  brandAccent: { color: Brand.accent },
  hero: { gap: Spacing.two },
  heroTitle: { color: "#ffffff", fontSize: 32, lineHeight: 38, fontWeight: "900" },
  heroSub: { color: "#B0B4BA", fontSize: 16, lineHeight: 22 },
  steps: { gap: Spacing.three },
  step: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconText: { fontSize: 22, lineHeight: 26 },
  stepBody: { flex: 1, gap: 1 },
  stepTitle: { color: "#ffffff", fontSize: 15 },
  stepText: { color: "#9aa0a6", fontSize: 13, lineHeight: 18 },
  cta: {
    backgroundColor: Brand.accent,
    borderRadius: 999,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  ctaText: { color: Brand.accentInk, fontWeight: "800", fontSize: 16 },
  pressed: { opacity: 0.85 },
});
