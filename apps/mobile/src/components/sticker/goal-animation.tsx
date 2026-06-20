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

const BOX_W = 280;
const BOX_H = 190;
// Goal frame geometry (box pixel space).
const POST_L = 66;
const POST_R = 214;
const BAR_Y = 44;
const GROUND_Y = 126;
const BALL_R = 10;
// Ball flight: from in front of goal up into the top-right corner of the net.
const START_X = 140;
const START_Y = 180;
const END_X = 188;
const END_Y = 58;

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
  const impact = useSharedValue(0);
  const label = useSharedValue(0);

  useEffect(() => {
    vis.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(1850, withTiming(0, { duration: 400 })),
    );
    ball.value = withTiming(1, { duration: 680, easing: Easing.in(Easing.quad) });
    impact.value = withDelay(660, withTiming(1, { duration: 620, easing: Easing.out(Easing.quad) }));
    label.value = withDelay(700, withSpring(1, { damping: 9, stiffness: 150, mass: 0.7 }));

    if (Platform.OS !== "web") {
      const h = setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
        680,
      );
      const d = setTimeout(onDone, 2450);
      return () => {
        clearTimeout(h);
        clearTimeout(d);
      };
    }
    const d = setTimeout(onDone, 2450);
    return () => clearTimeout(d);
  }, [vis, ball, impact, label, onDone]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: vis.value }));

  const ballStyle = useAnimatedStyle(() => {
    const t = ball.value;
    const arc = -26 * Math.sin(Math.PI * t);
    return {
      transform: [
        { translateX: (END_X - START_X) * t },
        { translateY: (END_Y - START_Y) * t + arc },
        { scale: 1 - 0.32 * t },
      ],
    };
  });

  const impactStyle = useAnimatedStyle(() => ({
    opacity: (1 - impact.value) * 0.9,
    transform: [{ scale: 0.3 + impact.value * 2.1 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: Math.min(label.value, 1),
    transform: [{ scale: 0.4 + label.value * 0.6 }],
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

        {/* net-impact ring */}
        <Animated.View style={[styles.ring, { left: END_X - 9, top: END_Y - 9 }, impactStyle]} />

        {/* the ball */}
        <Animated.View style={[styles.ball, { left: START_X - BALL_R, top: START_Y - BALL_R }, ballStyle]} />

        {/* GOL! pop */}
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
    backgroundColor: "rgba(0,0,0,0.82)",
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
  ring: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FFE08A",
  },
  labelWrap: { position: "absolute", top: 70, left: 0, right: 0, alignItems: "center" },
  label: { color: "#EF9F27", fontSize: 44, lineHeight: 50, fontWeight: "900" },
});
