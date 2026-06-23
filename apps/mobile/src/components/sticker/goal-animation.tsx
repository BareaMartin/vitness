import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Line, Rect } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";

/** A full-screen "ball into the net" celebration, played when a golazo lands. */

const BOX_W = 300;
const BOX_H = 210;
// Goal frame geometry (box pixel space).
const POST_L = 68;
const POST_R = 232;
const BAR_Y = 44;
const GROUND_Y = 135;
const BALL_R = 12;
// Ball flight: arcs from center in front of goal into the top-right corner.
const START_X = 150;
const START_Y = 196;
const END_X = 204;
const END_Y = 62;

const NET_COLOR = "rgba(255,255,255,0.22)";
const FRAME_COLOR = "#ffffff";

const V_LINES = (() => {
  const xs: number[] = [];
  for (let x = POST_L + 12; x < POST_R; x += 15) xs.push(x);
  return xs;
})();
const H_LINES = (() => {
  const ys: number[] = [];
  for (let y = BAR_Y + 12; y < GROUND_Y; y += 13) ys.push(y);
  return ys;
})();

export function GoalCelebration({ onDone }: { onDone: () => void }) {
  const vis = useSharedValue(0);
  const ball = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  const label = useSharedValue(0);

  useEffect(() => {
    // Total ~3000ms: fade in → hold → fade out
    vis.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(2300, withTiming(0, { duration: 500 })),
    );
    ball.value = withTiming(1, { duration: 680, easing: Easing.in(Easing.quad) });
    // Three rings burst out from impact point at staggered delays
    ring1.value = withDelay(660, withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }));
    ring2.value = withDelay(740, withTiming(1, { duration: 820, easing: Easing.out(Easing.quad) }));
    ring3.value = withDelay(870, withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }));
    // GOL! springs in with overshoot
    label.value = withDelay(700, withSpring(1, { damping: 7, stiffness: 120, mass: 0.7 }));

    if (Platform.OS !== "web") {
      const h1 = setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}),
        620,
      );
      const h2 = setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
        700,
      );
      const d = setTimeout(onDone, 3000);
      return () => {
        clearTimeout(h1);
        clearTimeout(h2);
        clearTimeout(d);
      };
    }
    const d = setTimeout(onDone, 3000);
    return () => clearTimeout(d);
  }, [vis, ball, ring1, ring2, ring3, label, onDone]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: vis.value }));

  const ballStyle = useAnimatedStyle(() => {
    const t = ball.value;
    const arc = -28 * Math.sin(Math.PI * t);
    return {
      transform: [
        { translateX: (END_X - START_X) * t },
        { translateY: (END_Y - START_Y) * t + arc },
        { scale: 1 - 0.3 * t },
      ],
    };
  });

  const ring1Style = useAnimatedStyle(() => ({
    opacity: (1 - ring1.value) * 0.9,
    transform: [{ scale: 0.3 + ring1.value * 2.1 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: (1 - ring2.value) * 0.65,
    transform: [{ scale: 0.2 + ring2.value * 2.8 }],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    opacity: (1 - ring3.value) * 0.4,
    transform: [{ scale: 0.1 + ring3.value * 3.4 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: Math.min(label.value, 1),
    transform: [{ scale: 0.3 + label.value * 0.7 }],
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <View style={styles.box}>
        <Svg width={BOX_W} height={BOX_H} style={StyleSheet.absoluteFill}>
          {/* net mesh */}
          {V_LINES.map((x) => (
            <Line key={`v${x}`} x1={x} y1={BAR_Y} x2={x} y2={GROUND_Y} stroke={NET_COLOR} strokeWidth={1} />
          ))}
          {H_LINES.map((y) => (
            <Line key={`h${y}`} x1={POST_L} y1={y} x2={POST_R} y2={y} stroke={NET_COLOR} strokeWidth={1} />
          ))}
          {/* goal frame: posts + crossbar */}
          <Line x1={POST_L} y1={BAR_Y} x2={POST_L} y2={GROUND_Y} stroke={FRAME_COLOR} strokeWidth={5} strokeLinecap="round" />
          <Line x1={POST_R} y1={BAR_Y} x2={POST_R} y2={GROUND_Y} stroke={FRAME_COLOR} strokeWidth={5} strokeLinecap="round" />
          <Line x1={POST_L} y1={BAR_Y} x2={POST_R} y2={BAR_Y} stroke={FRAME_COLOR} strokeWidth={5} strokeLinecap="round" />
          {/* ground line */}
          <Rect x={0} y={GROUND_Y} width={BOX_W} height={3} fill="#1D7A3A" />
        </Svg>

        {/* three staggered impact rings expanding from where ball hits net */}
        <Animated.View style={[styles.ring1, { left: END_X - 11, top: END_Y - 11 }, ring1Style]} />
        <Animated.View style={[styles.ring2, { left: END_X - 18, top: END_Y - 18 }, ring2Style]} />
        <Animated.View style={[styles.ring3, { left: END_X - 28, top: END_Y - 28 }, ring3Style]} />

        {/* the ball */}
        <Animated.View style={[styles.ball, { left: START_X - BALL_R, top: START_Y - BALL_R }, ballStyle]} />

        {/* GOL! springs in from below */}
        <Animated.View style={[styles.labelWrap, labelStyle]}>
          <ThemedText type="title" style={styles.label}>
            ¡GOL!
          </ThemedText>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  box: { width: BOX_W, height: BOX_H },
  ball: {
    position: "absolute",
    width: BALL_R * 2,
    height: BALL_R * 2,
    borderRadius: BALL_R,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c9ccd1",
  },
  ring1: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: "#FFE08A",
  },
  ring2: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFE08A",
  },
  ring3: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "rgba(255,224,138,0.55)",
  },
  labelWrap: { position: "absolute", top: 84, left: 0, right: 0, alignItems: "center" },
  label: { color: "#FFE08A", fontSize: 64, lineHeight: 72, fontWeight: "900", letterSpacing: 3 },
});
